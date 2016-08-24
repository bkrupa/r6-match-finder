declare var Sideshow: SideshowTutorial;

declare interface SideshowTutorial {
    config?: SideshowConfig;

    registerWizard?: (config: SideshowWizardConfig) => SideshowWizard;
    runWizard?: (config: SideshowWizardConfig) => void;
    init(): void;
    goToStep(i: number);
    start(config: SideshowStartConfig);

    CloseButton: any;
}

declare interface SideshowStartConfig {
    onlyNew?: boolean;
    listAll?: boolean;
    wizardName?: string;
}

declare interface SideshowConfig {
    language?: string;
}

declare interface SideshowWizard {
    _storyline?: Array<StorylineStep>;
    affects?: Array<string>;
    currentStep?: StorylineStep;
    description?: string;
    estimatedTime?: string;
    listeners?: WizardListeners;
    name?: string;

    preparation?: string;
    relatedWizards?: Array<string>;
    showStepPosition?: boolean;
    title?: string;

    storyLine(config: StorylineConfig): void;
    play(): void;
}

declare interface SideshowWizardConfig {
    name?: string;
    title?: string;
    description?: string;
    estimatedTime?: string;
    affects?: Array<any>;

    listeners?: WizardListeners;
    preparation?: (callback) => void;

    relatedWizards?: Array<string>;
}

declare interface StorylineConfig {
    showStepPosition?: boolean;
    steps?: Array<StorylineStep>;
}

declare interface StorylineStep {
    name?: string;
    title?: string;
    text?: string | Function;
    subject?: string;
    targets?: string;
    format?: string;
    completingConditions?: Array<Function>;
    autoContinue?: boolean;
    lockSubject?: boolean;

    listeners?: StepListeners;

    skipIf?: () => boolean;
}

declare interface WizardListeners {
    beforeWizardStarts?: () => void;
    afterWizardEnds?: () => void;
}

declare interface StepListeners {
    beforeStep?: () => void;
    afterStep?: () => void;
}