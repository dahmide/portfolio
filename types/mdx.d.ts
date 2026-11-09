declare module "*.mdx" {
    import type { ComponentType } from "react";
    const MDXComponent: ComponentType<object>;
    export default MDXComponent;
}
