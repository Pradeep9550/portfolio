"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: BackgroundGradientAnimationProps) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  // Use ref for smooth animation coordinates (avoid unused var warning & re-renders)
  const coords = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      coords.current.x += (target.current.x - coords.current.x) / 20;
      coords.current.y += (target.current.y - coords.current.y) / 20;

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(
          coords.current.x
        )}px, ${Math.round(coords.current.y)}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
  };

  // CSS variables without `as any`
  const styleVars: React.CSSProperties = {
    "--gradient-background-start": gradientBackgroundStart,
    "--gradient-background-end": gradientBackgroundEnd,
    "--first-color": firstColor,
    "--second-color": secondColor,
    "--third-color": thirdColor,
    "--fourth-color": fourthColor,
    "--fifth-color": fifthColor,
    "--pointer-color": pointerColor,
    "--size": size,
    "--blending-value": blendingValue,
  };

  return (
    <div
      style={styleVars}
      className={cn(
        "w-full h-full absolute overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      {/* Gooey filter */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      <div className={cn("", className)}>{children}</div>

      {/* Gradients */}
      <div
        className={cn(
          "gradients-container h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
        onMouseMove={interactive ? handleMouseMove : undefined}
      >
        {[
          { color: "first-color", animate: "first", origin: "center center" },
          { color: "second-color", animate: "second", origin: "calc(50%-400px)" },
          { color: "third-color", animate: "third", origin: "calc(50%+400px)" },
          { color: "fourth-color", animate: "fourth", origin: "calc(50%-200px)" },
          {
            color: "fifth-color",
            animate: "fifth",
            origin: "calc(50%-800px) calc(50%+800px)",
          },
        ].map(({ color, animate, origin }, i) => (
          <div
            key={i}
            className={cn(
              "absolute",
              `w-[var(--size)] h-[var(--size)]`,
              "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
              `opacity-100 animate-${animate}`,
              `[background:radial-gradient(circle_at_center,_rgba(var(--${color}),_0.8)_0,_rgba(var(--${color}),_0)_50%)]`,
              `[mix-blend-mode:var(--blending-value)]`,
              `[transform-origin:${origin}]`
            )}
          ></div>
        ))}

        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute opacity-70 w-full h-full -top-1/2 -left-1/2",
              `[background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)]`,
              `[mix-blend-mode:var(--blending-value)]`
            )}
          />
        )}
      </div>
    </div>
  );
};
