import React from "react";

/**
 * EmptyState component
 * Props: icon, title, description, action (JSX button/link)
 */
export default React.memo(function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className="cn-empty">
      <div className="cn-empty-icon">{icon}</div>
      {title && <h3 className="cn-empty-title">{title}</h3>}
      {description && <p className="cn-empty-desc">{description}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
});
