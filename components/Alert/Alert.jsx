import { AlertTriangle, Loader2 } from "lucide-react";

const Alert = ({ type, message, className = "" }) => {
  if (!message) return null;

  let classes = `p-4 mb-8 rounded-xl shadow-md flex items-start gap-3 border-l-4 ${className}`;
  let Icon = AlertTriangle;
  let iconClasses = "h-5 w-5 mt-0.5 flex-shrink-0";

  if (type === "error") {
    classes += " text-red-800 border-red-500 bg-red-50";
    iconClasses += " text-red-500";
  } else if (type === "submitting") {
    classes += " bg-gray-100 border-blue-500 text-gray-800";
    iconClasses += " text-blue-500 animate-spin";
    Icon = Loader2;
  }

  return (
    <div className={classes}>
      <Icon className={iconClasses} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Alert;
