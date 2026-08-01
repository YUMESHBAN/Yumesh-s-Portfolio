"use client";

export const workflowSteps = [
  {
    label: "Brief",
    title: "Understand",
    description: "Start with a focused conversation to align on the user, outcome, constraints, and success criteria.",
    detail: "Discuss the idea, surface assumptions, and identify the core user task before scope begins to expand.",
    output: "A shared brief, success criteria, and priority list",
  },
  {
    label: "Blueprint",
    title: "Architect",
    description: "Map the interface, data flow, and implementation path before the work expands.",
    detail: "Turn the brief into product structure, technical choices, and a realistic delivery path.",
    output: "Interface map and build plan",
  },
  {
    label: "Implementation",
    title: "Build",
    description: "Create responsive features and content workflows with clear, maintainable code.",
    detail: "Build the product in focused increments, keeping the interface, data, and content operations connected.",
    output: "Working features and usable content flows",
  },
  {
    label: "Quality check",
    title: "Test",
    description: "Review the paths that matter most for usability, performance, and reliability.",
    detail: "Test the journeys people actually use, then resolve the issues that would weaken the release.",
    output: "Release checks and focused fixes",
  },
  {
    label: "Iteration",
    title: "Improve",
    description: "Refine from feedback, real content, and what users need next.",
    detail: "Use real usage and feedback to decide what deserves attention after the first useful release.",
    output: "A prioritised next-iteration path",
  },
  {
    label: "Release",
    title: "Ready to ship",
    description: "Package a confident release with the product, handoff, and next steps in place.",
    detail: "Finish the release checks, make the product available, and leave a clear path for its next improvement.",
    output: "A live product and practical handoff",
  },
] as const;

function PhaseIllustration({ phase }: { phase: (typeof workflowSteps)[number]["title"] }) {
  const commonProps = {
    className: "h-auto w-full max-w-md text-blue-300 sm:-translate-x-24 sm:origin-left sm:scale-150",
    viewBox: "0 0 320 220",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (phase === "Understand") {
    return <svg {...commonProps}><circle cx="112" cy="111" r="43" /><circle cx="112" cy="111" r="25" opacity=".7" /><circle cx="112" cy="111" r="7" fill="currentColor" stroke="none" /><path d="M63 52 35 24M67 161l-31 27" /><path d="m34 24 3 15 15-3M36 188l15-3-3-15" /><rect x="187" y="45" width="92" height="43" rx="6" /><path d="M202 60h42M202 70h60M202 80h31" opacity=".65" /><rect x="202" y="119" width="77" height="48" rx="6" /><path d="M217 134h47M217 144h31M217 154h40" opacity=".65" /><path d="M155 90h32M155 137h47" strokeDasharray="4 5" /><circle cx="173" cy="90" r="3" fill="currentColor" stroke="none" /><circle cx="184" cy="137" r="3" fill="currentColor" stroke="none" /><text x="63" y="211" fill="currentColor" stroke="none" fontSize="11" opacity=".62">USER SIGNALS</text></svg>;
  }

  if (phase === "Architect") {
    return <svg {...commonProps}><rect x="108" y="22" width="104" height="48" rx="7" /><path d="M108 40h104" opacity=".65" /><circle cx="122" cy="31" r="3" fill="currentColor" stroke="none" /><path d="M140 54h39M160 70v29M71 118v-17h178v17M71 101V86h89M249 101V86h-89" /><circle cx="160" cy="101" r="4" fill="currentColor" stroke="none" /><rect x="31" y="118" width="80" height="50" rx="7" /><rect x="120" y="118" width="80" height="50" rx="7" /><rect x="209" y="118" width="80" height="50" rx="7" /><path d="M47 135h32M47 147h48M136 135h41M136 147h27M225 135h46M225 147h29" opacity=".65" /><path d="M55 184h210" opacity=".45" /><circle cx="71" cy="184" r="4" fill="currentColor" stroke="none" /><circle cx="160" cy="184" r="4" fill="currentColor" stroke="none" /><circle cx="249" cy="184" r="4" fill="currentColor" stroke="none" /><text x="38" y="207" fill="currentColor" stroke="none" fontSize="11" opacity=".62">INTERFACE</text><text x="130" y="207" fill="currentColor" stroke="none" fontSize="11" opacity=".62">LOGIC</text><text x="218" y="207" fill="currentColor" stroke="none" fontSize="11" opacity=".62">DATA</text></svg>;
  }

  if (phase === "Build") {
    return <svg {...commonProps}><rect x="31" y="26" width="174" height="132" rx="8" /><path d="M31 52h174" opacity=".65" /><circle cx="47" cy="39" r="4" fill="currentColor" stroke="none" /><circle cx="61" cy="39" r="4" opacity=".55" /><circle cx="75" cy="39" r="4" opacity=".3" /><path d="M55 76 42 89l13 13M83 75l-10 35M100 76l14 13-14 13" strokeWidth="2.5" /><path d="M127 76h49M127 90h35M127 104h58M55 125h121M55 139h82" opacity=".7" /><rect x="225" y="67" width="64" height="42" rx="6" /><rect x="225" y="128" width="64" height="42" rx="6" /><path d="M205 88h20M205 149h20M257 109v19" /><circle cx="205" cy="88" r="4" fill="currentColor" stroke="none" /><circle cx="205" cy="149" r="4" fill="currentColor" stroke="none" /><path d="M242 82h30M242 94h19M242 143h30M242 155h20" opacity=".65" /><text x="31" y="204" fill="currentColor" stroke="none" fontSize="11" opacity=".62">COMPONENT ASSEMBLY</text></svg>;
  }

  if (phase === "Test") {
    return <svg {...commonProps}><path d="M160 25 218 47v41c0 43-25 69-58 82-33-13-58-39-58-82V47l58-22Z" /><path d="m133 91 19 19 37-42" strokeWidth="3" /><rect x="29" y="53" width="55" height="28" rx="5" /><rect x="29" y="96" width="55" height="28" rx="5" /><rect x="29" y="139" width="55" height="28" rx="5" /><path d="m42 67 5 5 9-11M42 110l5 5 9-11M42 153l5 5 9-11" /><path d="M63 67h10M63 110h10M63 153h10" opacity=".65" /><path d="M240 151h52M240 151v-76" /><path d="m245 135 13-19 13 8 16-34" strokeWidth="2.4" /><circle cx="258" cy="116" r="3" fill="currentColor" stroke="none" /><circle cx="271" cy="124" r="3" fill="currentColor" stroke="none" /><circle cx="287" cy="90" r="3" fill="currentColor" stroke="none" /><text x="204" y="178" fill="currentColor" stroke="none" fontSize="10" opacity=".62">RELEASE CHECKS</text></svg>;
  }

  if (phase === "Improve") {
    return <svg {...commonProps}><path d="M84 81a67 67 0 0 1 111-22" strokeWidth="2.4" /><path d="m180 42 17 19-25 5" /><path d="M237 136a67 67 0 0 1-111 22" strokeWidth="2.4" /><path d="m141 178-17-19 25-5" /><circle cx="160" cy="110" r="32" /><path d="M143 110h34M160 93v34" opacity=".75" /><rect x="28" y="40" width="70" height="46" rx="7" /><path d="M43 55h40M43 66h25" opacity=".65" /><path d="M98 63h24" strokeDasharray="4 5" /><rect x="222" y="126" width="70" height="46" rx="7" /><path d="M237 157h11v-15h11v15h11v-24h11" /><path d="M198 151h24" strokeDasharray="4 5" /><circle cx="62" cy="147" r="15" /><path d="M55 147h14M62 140v14" /><text x="35" y="206" fill="currentColor" stroke="none" fontSize="11" opacity=".62">FEEDBACK → ITERATION</text></svg>;
  }

  return <svg {...commonProps}><path d="M44 156h232" /><path d="M58 156V89h73v67M189 156V69h73v87" /><path d="M75 104h39M75 119h39M75 134h24M206 84h39M206 99h39M206 114h39M206 129h24" opacity=".65" /><path d="M131 104h58M160 104V50" /><path d="m143 65 17-17 17 17" strokeWidth="2.8" /><circle cx="160" cy="105" r="20" fill="#0b0b0c" /><path d="m149 105 8 8 16-18" strokeWidth="3" /><path d="M86 178h148" /><circle cx="105" cy="178" r="4" fill="currentColor" stroke="none" /><circle cx="160" cy="178" r="4" fill="currentColor" stroke="none" /><circle cx="215" cy="178" r="4" fill="currentColor" stroke="none" /><text x="92" y="206" fill="currentColor" stroke="none" fontSize="11" opacity=".62">LIVE RELEASE HANDOFF</text></svg>;
}

type WorkflowPanelProps = {
  activeStep: number;
  isPinned: boolean;
  onSelectStep: (index: number) => void;
};

export function WorkflowPanel({ activeStep, isPinned, onSelectStep }: WorkflowPanelProps) {

  return (
    <div className="overflow-visible" aria-label="A six-step development workflow">
      <div className="border-b border-white/10 px-4 pb-7 pt-8 sm:px-6 lg:-ml-24 lg:w-[calc(100%+6rem)]">
        <ol className="relative grid grid-cols-6 gap-1 sm:gap-3">
          <div className="absolute left-[8.333%] right-[8.333%] top-5 h-px bg-white/15" aria-hidden="true" />
          <div
            className="absolute left-[8.333%] right-[8.333%] top-5 h-px origin-left bg-blue-400 transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${activeStep / (workflowSteps.length - 1)})` }}
            aria-hidden="true"
          />
          {workflowSteps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <li key={step.title} className="relative">
                <button
                  type="button"
                  onClick={() => onSelectStep(index)}
                  className="group flex w-full flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[#0b0b0c] text-xs font-semibold transition-colors duration-500 motion-reduce:transition-none ${isActive ? "border-blue-300 bg-blue-400 text-[#0b0b0c] ring-4 ring-blue-400/15" : isComplete ? "border-blue-400/70 text-blue-300" : "border-white/35 text-white/70 group-hover:border-white/65"}`}>
                    {isActive ? <span className="absolute inset-0 rounded-full border border-blue-200 motion-safe:animate-ping" aria-hidden="true" /> : null}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`mt-3 hidden whitespace-nowrap text-[11px] font-semibold transition-colors duration-500 sm:block ${isActive ? "text-blue-300" : "text-white/45 group-hover:text-white/75"}`}>{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div key={activeStep} className="workflow-stage-content grid gap-4 px-5 py-8 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-[minmax(12rem,0.78fr)_minmax(0,1.22fr)] md:items-center lg:min-h-[27rem]" aria-live="polite">
        <div className="flex min-h-56 items-center justify-start py-4 sm:min-h-64 sm:py-6">
          <PhaseIllustration phase={workflowSteps[activeStep].title} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">{workflowSteps[activeStep].label}</p>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 motion-safe:animate-pulse" aria-hidden="true" />
              {isPinned ? "Selected" : "In progress"}
            </span>
          </div>
          <h3 className="mt-3 text-4xl font-semibold text-blue-200">{workflowSteps[activeStep].title}</h3>
          <p className="site-muted mt-4 max-w-lg text-base leading-7">{workflowSteps[activeStep].description}</p>
          <div className="mt-6 border-l border-blue-400/45 pl-4 text-base leading-7 text-white/65">
            <p>{workflowSteps[activeStep].detail}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-200/80">Output / {workflowSteps[activeStep].output}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
