import { Helmet } from "react-helmet-async";

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Helmet>
      <title>{title} | Workify</title>
    </Helmet>
  );
};
export default PageTitle;
