import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/PostForm/PostForm";
import { useNavigate } from "react-router-dom";
import { employer_routes } from "@/routes/routes.const";

export default function EditEmployerPost() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-background h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`${employer_routes.BASE}/${employer_routes.POSTS}`, {
                state: { refresh: true },
              })
            }
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-1">Update your post details</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <PostForm isEditing={true} actor="employer" />
        </div>
      </div>
    </div>
  );
}
