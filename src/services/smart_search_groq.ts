import {
  JobLevel,
  JobType,
  ExperienceLevel,
  EducationLevel,
} from "@/constants/job.constant";
import type { JobsAdvancedSearchParams } from "@/types/job.type";
import type { Province } from "@/types/location.type";
import type { Industry } from "@/types";

interface SmartSearchOptions {
  provinces: Province[];
  industries: Industry[];
}

/**
 * Extract job search parameters from natural language input using Gemini AI
 */
export const extractSearchParams = async (
  userInput: string,
  options: SmartSearchOptions
): Promise<Partial<JobsAdvancedSearchParams>> => {
  const { provinces, industries } = options;

  // Build prompt with all available enum values and reference data
  const prompt = buildExtractionPrompt(userInput, provinces, industries);

  try {
    // Call LLM API (Groq or Gemini)
    const response = await callLLMAPI(prompt);

    // Parse and validate response
    const extractedParams = parseLLMResponse(response);

    return extractedParams;
  } catch (error) {
    console.error("Error extracting search params from LLM:", error);
    throw error;
  }
};

/**
 * Build comprehensive prompt for Gemini to extract search parameters
 */
const buildExtractionPrompt = (
  userInput: string,
  provinces: Province[],
  industries: Industry[]
): string => {
  const provincesList = provinces
    .map((p) => `- ID: ${p.id}, Name: "${p.name}"`)
    .join("\n");

  const industriesList = industries
    .map((i) => `- ID: ${i.id}, Name: "${i.name}"`)
    .join("\n");

  return `You are a job search parameter extraction assistant. Extract structured search parameters from the user's natural language input.

USER INPUT: "${userInput}"

AVAILABLE PROVINCES (use exact ID):
${provincesList || "No provinces available"}

AVAILABLE INDUSTRIES (use exact ID):
${industriesList || "No industries available"}

EXTRACTION RULES:

1. **keyword** (string, optional): Extract ONLY the job title/position name. This is the EXACT job title that employers post (e.g., "Software Engineer", "Marketing Manager", "Frontend Developer").
   
   CRITICAL RULES FOR KEYWORD:
   - ONLY extract if the input CLEARLY mentions a job title/position name
   - DO NOT extract skills, technologies, or requirements as keyword (e.g., "React", "Node.js", "3 years experience" are NOT keywords)
   - DO NOT extract company names, locations, or other attributes as keyword
   - DO NOT extract general descriptions like "developer", "manager" without context - these are too vague
   - ONLY extract when it's a SPECIFIC job title (e.g., "React Developer", "Senior Software Engineer", "Product Manager")
   - If uncertain, return null for keyword - PRECISION over RECALL
   - Examples of VALID keywords: "Software Engineer", "Marketing Manager", "Frontend Developer", "Data Analyst"
   - Examples of INVALID keywords (should be null): "React", "Node.js", "remote work", "startup", "3 years", "Ho Chi Minh City"

2. **provinceIds** (number[], optional): Extract province IDs from the list above. Match province names mentioned in input (can be Vietnamese or English, handle typos like "VN đồng" = "Việt Nam đồng"). Return array of IDs only if province is mentioned.

3. **industryIds** (number[], optional): Extract industry IDs from the list above. Match industry names mentioned in input. Return array of IDs only if industry is mentioned.

4. **jobLevels** (string[], optional): Extract from these EXACT enum values only:
   - INTERN (for intern, thực tập, internship)
   - ENTRY_LEVEL (for entry level, junior, mới ra trường, fresher)
   - STAFF (for staff, nhân viên)
   - ENGINEER (for engineer, kỹ sư)
   - SUPERVISOR (for supervisor, giám sát)
   - MANAGER (for manager, quản lý)
   - DIRECTOR (for director, giám đốc)
   - SENIOR_MANAGER (for senior manager, quản lý cấp cao)
   - EXECUTIVE (for executive, lãnh đạo cấp cao)

5. **experienceLevels** (string[], optional): Extract from these EXACT enum values only:
   - LESS_THAN_ONE_YEAR (for < 1 year, dưới 1 năm, 0-1 năm)
   - ONE_TO_TWO_YEARS (for 1-2 years, 1-2 năm)
   - TWO_TO_FIVE_YEARS (for 2-5 years, 2-5 năm, 3 năm, 4 năm, etc.)
   - FIVE_TO_TEN_YEARS (for 5-10 years, 5-10 năm, 6 năm, 7 năm, etc.)
   - MORE_THAN_TEN_YEARS (for > 10 years, trên 10 năm, 10+ năm)
   
   Example: "3 years experience" → TWO_TO_FIVE_YEARS
   Example: "1 year experience" → ONE_TO_TWO_YEARS
   Example: "5 years experience" → FIVE_TO_TEN_YEARS

6. **educationLevels** (string[], optional): Extract from these EXACT enum values only:
   - HIGH_SCHOOL (for high school, THPT, trung học)
   - COLLEGE (for college, cao đẳng)
   - UNIVERSITY (for university, đại học, cử nhân, bachelor)
   - POSTGRADUATE (for postgraduate, sau đại học)
   - MASTER (for master, thạc sĩ, master's degree)
   - DOCTORATE (for doctorate, tiến sĩ, PhD, doctor)
   - OTHER (for other, khác)

7. **jobTypes** (string[], optional): Extract from these EXACT enum values only:
   - FULL_TIME (for full-time, toàn thời gian, full time)
   - TEMPORARY_FULL_TIME (for temporary full-time, toàn thời gian thời vụ)
   - PART_TIME (for part-time, bán thời gian, part time)
   - TEMPORARY_PART_TIME (for temporary part-time, bán thời gian thời vụ)
   - CONTRACT (for contract, hợp đồng)
   - OTHER (for other, khác)

8. **postedWithinDays** (number, optional): Extract number of days. Only use these EXACT values:
   - 1 (for today, hôm nay, today)
   - 3 (for 3 days, 3 ngày)
   - 7 (for 1 week, 1 tuần, week)
   - 14 (for 2 weeks, 2 tuần)
   - 30 (for 1 month, 1 tháng, month)
   
   If multiple time periods mentioned, use the smallest (most recent) value.

9. **minSalary** (number, optional): Extract minimum salary as a number. Convert to the base unit (VND or USD).

10. **maxSalary** (number, optional): Extract maximum salary as a number. Convert to the base unit (VND or USD).

11. **salaryUnit** (string, optional): Extract from these EXACT values only:
    - VND (for VND, VN đồng, Việt Nam đồng, Vietnamese dong, đồng, vnd)
    - USD (for USD, dollar, đô la, usd)
    
    ONLY include salaryUnit if salary is mentioned AND unit is VND or USD.
    If user mentions other currencies (EUR, GBP, etc.), DO NOT include salaryUnit.
    Example: "20 euro" → no salaryUnit
    Example: "20 million VND" → salaryUnit: "VND", minSalary: 20000000
    Example: "1000 USD" → salaryUnit: "USD", minSalary: 1000

12. **sort** (string, optional): Extract sort preference. Format: "field:direction"
    - field: "createdAt" | "updatedAt" | "expirationDate"
    - direction: "asc" | "desc"
    - Default: "createdAt:desc" if not mentioned

IMPORTANT RULES:
- Only extract parameters that are EXPLICITLY mentioned in the user input
- For enum values, use EXACT enum strings as listed above (case-sensitive)
- For provinceIds and industryIds, match names and return the corresponding ID from the lists
- If a value doesn't match any enum, DO NOT include that parameter
- Handle typos and variations (e.g., "VN đồng" = "VND", "3 năm" = "TWO_TO_FIVE_YEARS")
- Convert salary amounts to numbers (e.g., "20 triệu" = 20000000, "1 triệu" = 1000000)
- If salary is mentioned without unit, assume VND for Vietnamese context
- Return ONLY valid parameters that can be extracted

OUTPUT FORMAT (MUST be valid JSON object, no markdown, no code blocks, no explanation):
{
  "keyword": "string or null",
  "provinceIds": [number] or null,
  "industryIds": [number] or null,
  "jobLevels": ["ENUM_VALUE"] or null,
  "experienceLevels": ["ENUM_VALUE"] or null,
  "educationLevels": ["ENUM_VALUE"] or null,
  "jobTypes": ["ENUM_VALUE"] or null,
  "postedWithinDays": number or null,
  "minSalary": number or null,
  "maxSalary": number or null,
  "salaryUnit": "VND" | "USD" or null,
  "sort": "field:direction" or null
}

CRITICAL: Return ONLY valid JSON object. Do not wrap in markdown code blocks. Do not add explanations. Return null for parameters that cannot be extracted. Return arrays for multi-value parameters.`;
};

/**
 * Call LLM API to extract parameters
 * Uses Groq API (requires VITE_GROQ_API_KEY)
 */
const callLLMAPI = async (prompt: string): Promise<string> => {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error(
      "Groq API key not configured. Please set VITE_GROQ_API_KEY in environment variables."
    );
  }

  return await callGroqAPI(prompt, groqApiKey);
};

/**
 * Call Groq API to extract parameters
 * Models: llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.
 */
const callGroqAPI = async (prompt: string, apiKey: string): Promise<string> => {
  // Using Llama 3.3 70B - latest and most powerful model
  const model = "llama-3.3-70b-versatile";
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a precise job search parameter extraction assistant. Always respond with valid JSON only, no markdown, no explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        max_tokens: 2000,
        response_format: { type: "json_object" }, // Force JSON response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from Groq API");
    }

    const text = data.choices[0].message.content;
    return text.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to call Groq API");
  }
};

/**
 * Parse and validate LLM response
 */
const parseLLMResponse = (
  response: string
): Partial<JobsAdvancedSearchParams> => {
  // Extract JSON from response (might be wrapped in markdown code blocks)
  let jsonString = response.trim();

  // Remove markdown code blocks if present
  jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  jsonString = jsonString.trim();

  try {
    const parsed = JSON.parse(jsonString);

    // Validate and clean the parsed object
    const validated: Partial<JobsAdvancedSearchParams> = {};

    // Validate keyword
    if (
      parsed.keyword &&
      typeof parsed.keyword === "string" &&
      parsed.keyword.trim()
    ) {
      validated.keyword = parsed.keyword.trim();
    }

    // Validate provinceIds
    if (Array.isArray(parsed.provinceIds) && parsed.provinceIds.length > 0) {
      validated.provinceIds = parsed.provinceIds
        .filter((id: unknown) => typeof id === "number" && id > 0)
        .map((id: number) => Number(id));
    }

    // Validate industryIds
    if (Array.isArray(parsed.industryIds) && parsed.industryIds.length > 0) {
      validated.industryIds = parsed.industryIds
        .filter((id: unknown) => typeof id === "number" && id > 0)
        .map((id: number) => Number(id));
    }

    // Validate jobLevels
    if (Array.isArray(parsed.jobLevels) && parsed.jobLevels.length > 0) {
      const validJobLevels = Object.values(JobLevel);
      validated.jobLevels = parsed.jobLevels.filter((level: string) =>
        validJobLevels.includes(
          level as (typeof JobLevel)[keyof typeof JobLevel]
        )
      );
    }

    // Validate experienceLevels
    if (
      Array.isArray(parsed.experienceLevels) &&
      parsed.experienceLevels.length > 0
    ) {
      const validExperienceLevels = Object.values(ExperienceLevel);
      validated.experienceLevels = parsed.experienceLevels.filter(
        (level: string) =>
          validExperienceLevels.includes(
            level as (typeof ExperienceLevel)[keyof typeof ExperienceLevel]
          )
      );
    }

    // Validate educationLevels
    if (
      Array.isArray(parsed.educationLevels) &&
      parsed.educationLevels.length > 0
    ) {
      const validEducationLevels = Object.values(EducationLevel);
      validated.educationLevels = parsed.educationLevels.filter(
        (level: string) =>
          validEducationLevels.includes(
            level as (typeof EducationLevel)[keyof typeof EducationLevel]
          )
      );
    }

    // Validate jobTypes
    if (Array.isArray(parsed.jobTypes) && parsed.jobTypes.length > 0) {
      const validJobTypes = Object.values(JobType);
      validated.jobTypes = parsed.jobTypes.filter((type: string) =>
        validJobTypes.includes(type as (typeof JobType)[keyof typeof JobType])
      );
    }

    // Validate postedWithinDays
    if (typeof parsed.postedWithinDays === "number") {
      const validDays = [1, 3, 7, 14, 30];
      if (validDays.includes(parsed.postedWithinDays)) {
        validated.postedWithinDays = parsed.postedWithinDays;
      }
    }

    // Validate minSalary
    if (typeof parsed.minSalary === "number" && parsed.minSalary > 0) {
      validated.minSalary = parsed.minSalary;
    }

    // Validate maxSalary
    if (typeof parsed.maxSalary === "number" && parsed.maxSalary > 0) {
      validated.maxSalary = parsed.maxSalary;
    }

    // Validate salaryUnit (only if salary is present)
    if ((validated.minSalary || validated.maxSalary) && parsed.salaryUnit) {
      if (parsed.salaryUnit === "VND" || parsed.salaryUnit === "USD") {
        validated.salaryUnit = parsed.salaryUnit;
      }
    }

    // Validate sort
    if (typeof parsed.sort === "string" && parsed.sort.includes(":")) {
      const [field, direction] = parsed.sort.split(":");
      const validFields = ["createdAt", "updatedAt", "expirationDate"];
      const validDirections = ["asc", "desc"];

      if (validFields.includes(field) && validDirections.includes(direction)) {
        validated.sort = parsed.sort;
      }
    }

    return validated;
  } catch (error) {
    console.error("Error parsing LLM response:", error);
    console.error("Response text:", response);
    throw new Error("Failed to parse response from LLM API");
  }
};
