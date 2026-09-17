import NextLink from "next/link";
import type { ComponentProps } from "react";
import { isWorkNavigationDisabled } from "@/lib/siteFeatures";

/** Disabled destinations retain their label and layout, with no navigable href. */
export default function SiteLink(props: ComponentProps<typeof NextLink>) {
  const href =
    typeof props.href === "string" ? props.href : (props.href.pathname ?? "");

  if (isWorkNavigationDisabled(href)) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={props["aria-label"]}
        id={props.id}
        style={props.style}
        title="Temporarily unavailable"
        className={`${props.className ?? ""} cursor-not-allowed opacity-50`}
      >
        {props.children}
      </span>
    );
  }

  return <NextLink {...props} />;
}
