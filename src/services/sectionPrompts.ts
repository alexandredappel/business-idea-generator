/**
 * This file contains specialized prompts for each section of the detailed business plan
 */

interface KeyInformation {
  problem: string;
  concept: string;
  valueProposition: string;
  targetMarket: string;
  originalText: string;
}

/**
 * Generate the Executive Summary section prompt
 */
export function getExecutiveSummaryPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a top-tier business strategy consultant, create an EXECUTIVE SUMMARY section for a comprehensive business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

EXECUTIVE SUMMARY REQUIREMENTS:
1. Write approximately 400-500 words specifically for the Executive Summary section
2. Include a compelling opening that clearly states the problem being solved in ${country}
3. Provide a concise description of the solution in one powerful sentence
4. Describe the target customers with specific demographic/psychographic details
5. Explain the revenue model with realistic projections
6. List short-term (3 months), medium-term (1 year) objectives
7. Highlight 2-3 key competitive advantages specific to ${country}'s market
8. Include 3-5 key market statistics/figures relevant to ${country}
9. Keep all information 100% focused on ${country}'s market context

FORMAT:
- Write a cohesive, well-structured executive summary
- Use professional business language but remain accessible
- Include specific numbers and data points where possible
- Focus on clarity and impact

This Executive Summary must provide a compelling overview that would convince potential investors or partners of the business viability in ${country}.
`;
}

/**
 * Generate the Market Analysis section prompt
 */
export function getMarketAnalysisPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a specialized market research consultant, create a comprehensive MARKET ANALYSIS AND POSITIONING section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

MARKET ANALYSIS REQUIREMENTS:
1. Write approximately 500-600 words specifically for the Market Analysis section
2. Break this into clear subsections: Problem and Solution, Simplified Market Study, and Competitive Analysis

For the Problem and Solution subsection:
- Provide an in-depth analysis of the problem with quantitative data specific to ${country}
- Explain how the solution addresses this problem effectively

For the Simplified Market Study subsection:
- Estimate the addressable market size in ${country} with calculation logic
- Identify 5 major trends influencing this market with recent statistics
- Include growth projections specific to this sector in ${country}

For the Competitive Analysis subsection:
- Create 3 detailed competitor cards with this structure:
  * Competitor name and description (specific to ${country})
  * Market share percentage (estimated)
  * 3-5 specific strengths
  * 3-5 specific weaknesses
  * Pricing strategy details
  * Value proposition
- Create a positioning matrix comparing your solution to competitors
- Analyze entry barriers and provide strategies to overcome them

FORMAT:
- Use clear subsection headers
- Structure information with bullet points where appropriate
- Include visual "cards" format for competitors
- Maintain professional tone with data-driven insights
- Focus on ${country}-specific information throughout

This Market Analysis must provide critical insights into the specific market conditions in ${country} for this business idea.
`;
}

/**
 * Generate the Concept and Value Proposition section prompt
 */
export function getConceptValuePrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a product development strategist, create a CONCEPT AND VALUE PROPOSITION section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

CONCEPT AND VALUE PROPOSITION REQUIREMENTS:
1. Write approximately 450-550 words specifically for this section
2. Break this into clear subsections: Detailed Concept Description, Unique Value Proposition, and Competitive Differentiation

For the Detailed Concept Description subsection:
- Explain exactly how the product/service works in practical terms
- Detail the user journey from awareness to purchase and usage
- Include technical/functional specifications tailored to ${country}'s market
- Describe the implementation approach considering the available budget

For the Unique Value Proposition (UVP) subsection:
- Create a powerful one-sentence UVP that clearly communicates the core value
- Explain why this proposition resonates specifically with the target market in ${country}
- Show how it addresses the identified problem

For the Competitive Differentiation subsection:
- Identify 5 specific factors that differentiate this business from competitors in ${country}
- Explain how each factor creates a meaningful advantage in ${country}'s market
- Compare your solution to existing alternatives in a structured format

FORMAT:
- Use clear subsection headers
- Include practical examples relevant to ${country}
- Maintain a balance between technical details and accessible language
- Focus on how the concept specifically addresses needs in ${country}

This Concept and Value Proposition section must clearly articulate what makes this business idea compelling and uniquely valuable in ${country}'s market context.
`;
}

/**
 * Generate the Client Profile section prompt
 */
export function getClientProfilePrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a consumer insights specialist, create a CLIENT PROFILE section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

CLIENT PROFILE REQUIREMENTS:
1. Write approximately 450-550 words specifically for the Client Profile section
2. Create 2-3 detailed customer personas highly specific to ${country}'s market

For each persona, structure as a detailed "card" including:

A) Demographics:
- Name (fictional but culturally appropriate for ${country})
- Age range
- Gender
- Occupation/profession common in ${country}
- Income level in ${country}'s context
- Education level
- Location within ${country} (specific region/city)
- Family situation

B) Psychographics:
- Primary needs and desires specific to ${country}'s cultural context
- Key frustrations related to the problem being solved
- Values and beliefs relevant to your offering
- Technology adoption level
- Risk tolerance
- Decision-making style

C) Purchase Journey:
- How they become aware of solutions like yours in ${country}
- Evaluation criteria they use to compare options
- Decision triggers specific to this market
- Common objections they might have
- Post-purchase expectations

D) Contact Points:
- Where to reach this persona in ${country} (online and offline channels)
- Media consumption habits specific to ${country}
- Influencers they trust in ${country}
- Communication preferences

FORMAT:
- Create visually distinct "cards" for each persona
- Use realistic details that reflect ${country}'s socioeconomic context
- Make each persona distinctly different to cover various segments
- Include specific behavioral patterns rooted in ${country}'s culture
- Keep information practical and actionable

These client profiles must feel authentic to ${country}'s market and provide a clear picture of who will use the product/service.
`;
}

/**
 * Generate the Business Model section prompt
 */
export function getBusinessModelPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a financial strategy consultant, create a BUSINESS MODEL section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

BUSINESS MODEL REQUIREMENTS:
1. Write approximately 450-550 words specifically for the Business Model section
2. Break this into clear subsections: Revenue Model, Cost Structure, and Simplified Budget Projections

For the Revenue Model subsection:
- Detail primary and secondary revenue streams appropriate for ${country}'s market
- Explain pricing structure (subscription, one-time, freemium, etc.) with justification
- Include sample pricing in ${country}'s local currency
- Analyze pricing relative to local purchasing power in ${country}
- Project revenue potential based on market size in ${country}

For the Cost Structure subsection:
- List startup costs with specific items and amounts in ${country}'s currency
- Detail monthly fixed costs (specific to operating in ${country})
- Estimate variable costs per unit/customer
- Identify customer acquisition costs specific to ${country}'s market
- Calculate customer lifetime value considering local context

For the Simplified Budget Projections subsection:
- Provide realistic 12-month revenue projections
- Create monthly operational cost estimates
- Calculate break-even timeline with specific assumptions
- Consider ${country}-specific factors that might affect financials
- Adapt all projections to work within the stated budget of ${budget}

FORMAT:
- Use tables for financial data where appropriate
- Include specific numbers and calculations
- Maintain a realistic approach based on ${country}'s economic context
- Consider industry benchmarks relevant to ${country}
- Balance optimism with pragmatism in projections

This Business Model section must present a financially viable approach specifically adapted to ${country}'s market conditions and economic realities.
`;
}

/**
 * Generate the Marketing Strategy section prompt
 */
export function getMarketingStrategyPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a digital marketing strategist, create a MARKETING STRATEGY AND ACQUISITION section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

MARKETING STRATEGY REQUIREMENTS:
1. Write approximately 500-600 words specifically for the Marketing Strategy section
2. Break this into clear subsections: Global Strategy, Priority Acquisition Channels, Content Strategy, and Conversion/Loyalty Strategy

For the Global Strategy subsection:
- Define positioning and brand identity appropriate for ${country}'s cultural context
- Outline messaging strategy aligned with local preferences
- Explain how marketing will address specific buyer behaviors in ${country}

For the Priority Acquisition Channels subsection:
- Identify 3-5 most effective marketing channels in ${country} for this business type
- For each channel, create a detailed "channel card" including:
  * Strategic justification for this channel in ${country}
  * Specific tactics to implement
  * Estimated budget allocation in local currency
  * Expected ROI metrics
  * Implementation timeline
- Prioritize channels based on effectiveness in ${country}'s specific market

For the Content Strategy subsection:
- Recommend content types that resonate with ${country}'s audience
- Outline topic areas that address local concerns and interests
- Suggest publishing frequency and distribution channels
- Include localization considerations specific to ${country}

For the Conversion and Loyalty Strategy subsection:
- Design lead generation techniques appropriate for ${country}
- Detail conversion process optimized for local customer journey
- Suggest loyalty program elements that appeal to ${country}'s consumers
- Include customer retention metrics to track

FORMAT:
- Use "card" format for channel strategies
- Include specific metrics and KPIs for measurement
- Maintain focus on ${country}-specific marketing approaches
- Consider available budget constraints
- Use bullet points for actionable implementation steps

This Marketing Strategy must be specifically tailored to ${country}'s media landscape, consumer behavior patterns, and cultural context.
`;
}

/**
 * Generate the Operational Roadmap section prompt
 */
export function getOperationalRoadmapPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As an operations and project management consultant, create an OPERATIONAL ROADMAP section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

OPERATIONAL ROADMAP REQUIREMENTS:
1. Write approximately 450-550 words specifically for the Operational Roadmap section
2. Create a structured timeline with key milestones and activities

Include these elements:

A) 0-3 Months: Foundations in ${country}
- List 5-7 specific actions required to launch in ${country}
- Include regulatory considerations specific to ${country}
- Detail initial team structure/hiring needs
- Outline product/service development milestones
- Specify first marketing activities

B) 4-6 Months: Initial Validation and Growth in ${country}
- Define key metrics to measure initial success
- Detail scaling activities based on early feedback
- Outline partnership development in ${country}
- Include product/service refinement steps
- List customer acquisition targets

C) 7-12 Months: Optimization and Expansion in ${country}
- Detail market expansion within ${country}
- Outline product/service line extensions
- Include team growth projections
- Specify operational efficiency improvements
- List revenue and customer targets

D) Key Performance Indicators (KPIs)
- Define 5-8 specific KPIs to track progress
- Include both leading and lagging indicators
- Specify measurement methodologies
- Set realistic targets for each timeframe

E) Launch Checklist
- Create a comprehensive pre-launch checklist
- Include ${country}-specific requirements (legal, regulatory, etc.)
- List key resources needed before launch

FORMAT:
- Use clear timeline structure
- Include specific, actionable items
- Ensure all activities are realistic within the budget constraints
- Consider ${country}-specific operational challenges
- Use bullet points for clarity

This Operational Roadmap must provide a clear, actionable plan for launching and growing the business in ${country}, considering local market conditions and regulations.
`;
}

/**
 * Generate the Toolkit section prompt
 */
export function getToolkitPrompt(
  data: KeyInformation,
  industry: string,
  country: string,
  budget: string
): string {
  return `
As a business technology and resources consultant, create a TOOLKIT section for a business plan based on this business idea:

BUSINESS CONTEXT:
Industry: ${industry}
Country: ${country} (All content must be 100% specific to this country)
Budget: ${budget}

ORIGINAL CONCEPT:
${data.concept}

IDENTIFIED PROBLEM:
${data.problem}

VALUE PROPOSITION:
${data.valueProposition}

TARGET MARKET:
${data.targetMarket}

TOOLKIT REQUIREMENTS:
1. Write approximately 400-500 words specifically for the Toolkit section
2. Focus on practical tools, resources, and services needed to execute the business plan in ${country}

Include these elements:

A) Essential Technology Tools
- Create a table with these columns: Function, Recommended Tool, Cost, Key Features, Budget Alternative
- Include 6-8 essential business functions (e.g., CRM, website, payments, marketing)
- Recommend specific tools available in ${country}
- List costs in ${country}'s local currency
- Ensure tools align with the stated budget level

B) Key Service Providers
- Identify 4-6 types of service providers needed (e.g., accounting, legal, marketing)
- For each, recommend specific providers in ${country}
- Include estimated costs and selection criteria
- Consider budget constraints in recommendations

C) Human Resources Needs
- List essential team roles for the first year
- Recommend hiring vs. outsourcing strategies appropriate for ${country}
- Include estimated salary ranges in local currency
- Suggest freelance platforms available in ${country}

D) Knowledge Resources
- Recommend industry-specific resources available in ${country}
- Include relevant local business associations
- List helpful books, courses, or training programs
- Suggest networking opportunities specific to ${country}

E) Implementation Guide
- Create a brief implementation sequence for setting up the toolkit
- Prioritize tools based on launch requirements
- Include budget allocation recommendations
- Suggest phased implementation approach

FORMAT:
- Use tables and structured lists
- Include specific, actionable recommendations
- Ensure all tools and resources are available in ${country}
- Consider budget constraints in all recommendations
- Make information practical and immediately useful

This Toolkit section must provide concrete, practical resources that would enable someone to immediately begin implementing the business plan in ${country}.
`;
} 