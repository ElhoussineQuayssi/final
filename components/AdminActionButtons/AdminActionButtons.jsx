import Link from "next/link";

const AdminActionButtons = ({ item, actions }) => (
  <div className="flex justify-end space-x-2">
    {actions.map((action) => {
      const Icon = action.icon;
      const handleClick = action.onClick ? () => action.onClick(item.id) : null;

      const linkProps = action.href ? { href: action.href(item) } : {};
      const Tag = action.href ? Link : "button";

      let iconStyle = {};
      if (action.key === "view") {
        iconStyle.color = "gray";
      } else if (action.key === "edit") {
        iconStyle.color = "#6495ED";
      } else if (action.key === "delete") {
        iconStyle.color = "#DC2626";
      }

      return (
        <Tag
          key={action.key}
          {...linkProps}
          onClick={handleClick}
          title={action.title}
          className={`p-2 rounded-full hover:bg-gray-100 transition duration-150`}
        >
          <Icon className="h-5 w-5" style={iconStyle} />
        </Tag>
      );
    })}
  </div>
);

export default AdminActionButtons;
