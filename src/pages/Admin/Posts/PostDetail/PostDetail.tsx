import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, User, Tag, Clock } from "lucide-react";
import { postService } from "@/services/post.service";
import { PostStatusColors, PostStatusLabelEN } from "@/constants/post.constant";
import { admin_routes } from "@/routes/routes.const";
import Loading from "@/components/Loading";

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPostById(Number(id)),
    enabled: !!id,
  });

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen">
       <Loading/>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Không tìm thấy bài viết</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`, { replace: true })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/edit/${post.id}`, { replace: true })}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          {/* Thumbnail */}
          {post.thumbnailUrl && <img src={post.thumbnailUrl || "/placeholder.svg"} alt={post.title} className="w-full h-64 object-cover" />}

          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={PostStatusColors[post.status]}>{PostStatusLabelEN[post.status]}</Badge>
                <Badge variant="outline">{post.category.title}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Tác giả:</span> {post.author.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Ngày tạo:</span> {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Thời gian đọc:</span> {post.readingTimeMinutes} phút
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Slug:</span> {post.slug}
                </span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags
                    ?.split("|")
                    .filter((tag) => tag.trim() !== "") 
                    .map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Nội dung:</h3>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
