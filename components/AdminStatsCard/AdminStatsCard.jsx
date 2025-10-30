import {
  Newspaper,
  FolderOpen,
  Mail,
  Eye,
  Users,
  CheckCircle,
  FileText,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const AdminStatsCard = ({ title, value, type }) => {
  let Icon = Mail;
  let bgColor = "#344675"; // Default dark blue
  let iconColor = "#FFFFFF";

  switch (type) {
    case "articles":
      Icon = Newspaper;
      bgColor = "#344675";
      break;
    case "projects":
      Icon = FolderOpen;
      bgColor = "#f093fb"; // Purple gradient start
      break;
    case "messages":
    case "total":
      Icon = Mail;
      bgColor = "#344675";
      break;
    case "views":
      Icon = Eye;
      bgColor = "#4acccd"; // Cyan
      break;
    case "admins":
      Icon = Users;
      bgColor = "#fb6340"; // Orange
      break;
    case "unread":
      Icon = MessageSquare;
      bgColor = "#f5365c"; // Red
      break;
    case "read":
      Icon = CheckCircle;
      bgColor = "#2dce89"; // Green
      break;
    case "blogs":
      Icon = FileText;
      bgColor = "#11cdef"; // Light blue
      break;
    default:
      Icon = TrendingUp;
      bgColor = "#344675";
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-3xl font-bold mb-2">
            {value}
          </p>
          <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="h-8 w-8" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCard;
