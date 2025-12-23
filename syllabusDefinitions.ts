
// This file is for the TEACHER to hardcode standard definitions (AO1) or Model Chains (AO2).
// These will appear as the default content for students if they haven't written their own yet.
//
// Format: 
// Key: "SectionID-SubsectionTitle-Index" (You can find these IDs by inspecting the app or looking at the console log if you add one)
// Note: The Index is 0-based (0 is the first point, 1 is the second...)

export const PREFILLED_DEFINITIONS: Record<string, string> = {
    // Example for 1.1.1 Scarcity
    "1.1-1.1 Scarcity, choice and opportunity cost-0": 
        "Scarcity is the fundamental economic problem resulting from the conflict between unlimited wants and limited (scarce) resources.",
    
    // Example for 1.1.3 Opportunity Cost
    "1.1-1.1 Scarcity, choice and opportunity cost-7": 
        "Opportunity cost is the benefit of the next best alternative foregone when a choice is made.",

    // You can add your "Effectiveness" definitions here as well if you add them to the checklist data.
};
