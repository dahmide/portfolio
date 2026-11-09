import { cn } from "@/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./Button.module.css";
import Link from "next/link";

type ButtonVariants = VariantProps<typeof buttonVariants>;
interface BaseButtonProps extends Omit<ButtonVariants, "variant"> {}

interface LinkButtonProps extends BaseButtonProps {
    variant: "link";
    href: string;
    external?: boolean;
    nativeButton?: false;
}

interface MainButtonProps extends BaseButtonProps {
    variant?: Exclude<ButtonVariants["variant"], "link">;
    href?: never;
    external?: never;
}

type ButtonProps = LinkButtonProps | MainButtonProps;

const buttonVariants = cva(styles.button, {
    variants: {
        variant: {
            default: styles.buttonDefault,
            ghost: styles.buttonGhost,
            outline: styles.buttonOutline,
            link: styles.buttonLink,
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export function Button({
    className,
    variant = "default",
    ...props
}: ButtonPrimitive.Props & ButtonProps) {
    if (variant === "link") {
        const { href, external, ...linkProps } = props;
        return (
            <ButtonPrimitive
                className={cn(buttonVariants({ variant, className }))}
                nativeButton={false}
                render={
                    external ? (
                        <a href={href} target="_blank" rel="no_referrer" />
                    ) : (
                        <Link href={href as string} />
                    )
                }
                {...linkProps}
            />
        );
    }
    return (
        <ButtonPrimitive
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    );
}
