import { useRef } from "react";

const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(255,255,255,0.25)",
}) => {
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty("--mouse-x", `${x}px`);
        divRef.current.style.setProperty("--mouse-y", `${y}px`);
        divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    };

    return (
        <>
            <style>
                {`
        .spotlight-card::before{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            var(--spotlight-color),
            transparent 80%
          );
          opacity:0;
          transition:opacity 0.5s ease;
          pointer-events:none;
        }

        .spotlight-card:hover::before,
        .spotlight-card:focus-within::before{
          opacity:0.6;
        }
        `}
            </style>

            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                className={`spotlight-card relative overflow-hidden ${className}`} style={{
                    "--mouse-x": "50%",
                    "--mouse-y": "50%",
                    "--spotlight-color": spotlightColor,
                }}
            >
                {children}
            </div>
        </>
    );
};

export default SpotlightCard;