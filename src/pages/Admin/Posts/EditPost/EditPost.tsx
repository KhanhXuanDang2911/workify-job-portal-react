import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/PostForm";
import { admin_routes } from "@/routes/routes.const";

export default function EditPost() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`, {
                state: { refresh: true },
              })
            }
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-1">Update post information</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <PostForm isEditing={true} />
        </div>
      </div>
    </div>
  );
}
