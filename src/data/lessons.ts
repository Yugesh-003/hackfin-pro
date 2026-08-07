/**
 * Static Lesson Content — all 10 curated lessons.
 *
 * AI only adds a personalized `insight` and `action` to each lesson at
 * render time. The core content here is never modified by AI.
 *
 * Each lesson has:
 *   - Title, topic, objective
 *   - Educational content (markdown)
 *   - Key takeaways
 *   - Exactly 2 quiz questions
 */

import type { Lesson } from "@/types";

export const LESSONS: Lesson[] = [
  // ── 1. Budgeting & Spending ────────────────────────────────────────────────
  {
    id: "lesson-budgeting",
    topic: "budgeting",
    title: "Budgeting & Spending: Taking Control of Your Money",
    objective:
      "Understand how to create and stick to a budget so your spending reflects your priorities.",
    estimatedMinutes: 3,
    defaultOrder: 1,
    content: `## What Is a Budget?

A budget is simply a plan for how you will spend your money each month. Without one, spending tends to expand to fill whatever is available — leaving nothing for savings or goals.

## The 50/30/20 Rule

One of the most popular budgeting frameworks:

- **50%** of take-home income → Needs (rent, groceries, utilities, transport)
- **30%** → Wants (dining out, entertainment, subscriptions, hobbies)
- **20%** → Savings & debt repayment

This isn't a rigid law — it's a starting point. Adjust the percentages based on your income level and goals.

## Why Budgets Fail

Most budgets fail not because of lack of discipline, but because they are unrealistic. A budget that leaves ₹0 for any enjoyment is almost impossible to sustain.

**Key insight:** Build in small discretionary allowances so you don't feel deprived. Deprived people make impulsive spending decisions.

## Zero-Based Budgeting

An alternative approach: give every rupee a job. At the start of each month, allocate your entire income to categories until you reach zero. Nothing is "unallocated."

## Practical Steps

1. Track all spending for one month (your statement is already doing this).
2. Categorize every expense.
3. Compare actual spending to your target allocations.
4. Adjust next month — this is an iterative process.`,
    keyTakeaways: [
      "A budget is a spending plan, not a restriction.",
      "The 50/30/20 rule is a useful starting framework.",
      "Realistic budgets work better than perfect budgets.",
      "Review and adjust your budget every month.",
    ],
    quiz: [
      {
        id: "bq1",
        question:
          "According to the 50/30/20 rule, what percentage of income should go toward savings and debt repayment?",
        options: ["10%", "20%", "30%", "50%"],
        correctIndex: 1,
        explanation:
          "The 50/30/20 rule allocates 20% of take-home income to savings and debt repayment.",
      },
      {
        id: "bq2",
        question: "Why do most budgets fail?",
        options: [
          "People earn too little",
          "Budgets are too complicated to understand",
          "Budgets are often unrealistic and leave no room for enjoyment",
          "Banks charge fees that disrupt the plan",
        ],
        correctIndex: 2,
        explanation:
          "Budgets fail most often because they are too restrictive, making them unsustainable. A good budget is realistic and accounts for small discretionary spending.",
      },
    ],
  },

  // ── 2. Smart Saving ────────────────────────────────────────────────────────
  {
    id: "lesson-saving",
    topic: "saving",
    title: "Smart Saving: Making Your Money Work Before You Spend It",
    objective:
      "Learn why saving must happen at the start of the month, not at the end.",
    estimatedMinutes: 3,
    defaultOrder: 2,
    content: `## Pay Yourself First

Most people save what's left after spending. Smart savers reverse this: they transfer a fixed amount to savings the moment their salary arrives. What's left is what they spend.

This single habit is the foundation of financial security.

## How Much Should You Save?

Start with whatever is realistic — even ₹500 per month. The habit matters more than the amount in the beginning. As your income grows, increase the percentage.

A common target:
- **Minimum:** 10% of income
- **Recommended:** 20% of income
- **Aggressive:** 30%+ for early financial independence

## High-Yield Savings vs. Regular Savings Accounts

A regular savings account in India earns 2.5–4% interest. Liquid mutual funds or FDs can offer 5–7% on short-term money. The difference compounds significantly over years.

## The Psychology of Saving

Saving feels like sacrifice — but this framing is wrong. Saving is **deferred spending**. You are choosing a future version of yourself who can afford a house, handle a job loss, or retire comfortably.

Reframe saving as: *"I'm paying my future self first."*

## Automating Saves

Set up automatic transfers on salary day. What you never see in your spending account, you never miss. This eliminates the need for willpower entirely.`,
    keyTakeaways: [
      "Pay yourself first — transfer savings before spending.",
      "Start with any amount; build the habit first.",
      "Automate savings to remove willpower dependency.",
      "Liquid funds or FDs can earn more than a savings account.",
    ],
    quiz: [
      {
        id: "sq1",
        question: "What does 'pay yourself first' mean?",
        options: [
          "Spend on personal needs before paying bills",
          "Transfer a fixed amount to savings before spending anything else",
          "Take a salary advance for personal expenses",
          "Invest before paying rent",
        ],
        correctIndex: 1,
        explanation:
          "'Pay yourself first' means automatically transferring money to savings the moment income arrives, before any discretionary spending.",
      },
      {
        id: "sq2",
        question: "Why is automating savings effective?",
        options: [
          "Banks give higher interest for auto-transfers",
          "It removes the need for daily discipline and willpower",
          "Government policy requires it",
          "It prevents the bank from charging fees",
        ],
        correctIndex: 1,
        explanation:
          "Automating savings removes human decision-making from the equation — you never 'choose' not to save because the money is already moved.",
      },
    ],
  },

  // ── 3. Emergency Fund ──────────────────────────────────────────────────────
  {
    id: "lesson-emergency-fund",
    topic: "emergency_fund",
    title: "Emergency Fund: Your Financial Safety Net",
    objective:
      "Understand what an emergency fund is, why it matters, and how to build one.",
    estimatedMinutes: 3,
    defaultOrder: 3,
    content: `## What Is an Emergency Fund?

An emergency fund is a dedicated pool of liquid savings set aside exclusively for genuine emergencies — job loss, medical crises, urgent home repairs.

It is **not** for vacations, shopping, or predictable expenses.

## Why It's Non-Negotiable

Without an emergency fund, any unexpected expense forces you to:
- Take on high-interest debt (credit cards, personal loans)
- Liquidate investments at the worst possible time
- Borrow from family — creating social strain

An emergency fund transforms financial shocks from crises into inconveniences.

## How Much Do You Need?

**Rule of thumb:** 3–6 months of essential monthly expenses.

If your monthly essentials (rent, groceries, utilities, EMIs) total ₹25,000, your emergency fund target is ₹75,000–₹1,50,000.

**Higher income volatility** (freelancers, entrepreneurs) → aim for 6–12 months.

## Where to Keep It

The emergency fund must be:
- **Liquid:** Accessible within 1–2 days
- **Stable:** Not in equity markets — value cannot drop when you need it most
- **Separate:** Not in your primary spending account

Best options in India:
- High-interest savings account (Kotak 811, IDFC FIRST, etc.)
- Liquid mutual funds
- Short-term FDs with premature withdrawal facility

## Building It Step by Step

Don't try to build 6 months of expenses in one shot. Set a first milestone: one month of expenses. Then two, then three.`,
    keyTakeaways: [
      "An emergency fund is for genuine emergencies only.",
      "Target 3–6 months of essential expenses.",
      "Keep it liquid, stable, and separate from spending.",
      "Build it incrementally — start with one month.",
    ],
    quiz: [
      {
        id: "efq1",
        question: "What is the recommended size of an emergency fund?",
        options: [
          "1 month of income",
          "3–6 months of essential expenses",
          "₹1 lakh flat for everyone",
          "6 months of total spending including wants",
        ],
        correctIndex: 1,
        explanation:
          "The standard recommendation is 3–6 months of essential monthly expenses (not income). Higher risk or volatility situations warrant the upper end.",
      },
      {
        id: "efq2",
        question:
          "Which of the following is NOT a good place to keep an emergency fund?",
        options: [
          "High-interest savings account",
          "Liquid mutual fund",
          "Equity stock market",
          "Short-term fixed deposit",
        ],
        correctIndex: 2,
        explanation:
          "Equity investments can drop in value at exactly the moment you need money most. Emergency funds must be in stable, liquid instruments.",
      },
    ],
  },

  // ── 4. Debt Management ─────────────────────────────────────────────────────
  {
    id: "lesson-debt",
    topic: "debt",
    title: "Debt Management: Escaping the Interest Trap",
    objective:
      "Learn to distinguish good debt from bad debt and develop a strategy to eliminate high-interest debt.",
    estimatedMinutes: 3,
    defaultOrder: 4,
    content: `## Good Debt vs. Bad Debt

Not all debt is harmful:
- **Good debt** creates value or appreciates over time (home loan, education loan)
- **Bad debt** funds depreciating items or lifestyle (credit card balances, personal loans for gadgets)

The distinction matters: good debt can be managed slowly; bad debt should be eliminated as fast as possible.

## The True Cost of Credit Card Debt

Credit card interest in India typically runs 36–42% per year. If you carry a ₹50,000 balance for one year, you pay ₹18,000–₹21,000 in interest alone — for nothing.

Always pay your full credit card balance before the due date.

## Debt Elimination Strategies

### Avalanche Method (mathematically optimal)
List all debts by interest rate. Pay minimum on all, then throw every extra rupee at the highest-rate debt. Saves the most money overall.

### Snowball Method (psychologically effective)
List all debts by balance — smallest first. Pay off the smallest balance first for quick wins, regardless of interest rate. The momentum keeps you motivated.

Both work. Choose what you'll stick to.

## Debt-to-Income Ratio

Your total monthly debt payments (EMIs, loan repayments) should ideally stay below 30–35% of gross monthly income. Above 40% is a danger zone.

## Avoiding New Debt

Before taking on any new loan or credit, ask: *"Would I pay cash for this if I could?"* If the answer is no, reconsider.`,
    keyTakeaways: [
      "Good debt builds value; bad debt funds consumption.",
      "Credit card debt at 36–42% APR is wealth-destroying.",
      "Avalanche method saves money; snowball builds momentum.",
      "Keep EMIs below 30–35% of income.",
    ],
    quiz: [
      {
        id: "dq1",
        question: "Which debt elimination strategy pays off the highest-interest debt first?",
        options: [
          "Snowball method",
          "Avalanche method",
          "Compound method",
          "Zero-based method",
        ],
        correctIndex: 1,
        explanation:
          "The avalanche method targets the highest interest rate debt first, minimizing total interest paid over time.",
      },
      {
        id: "dq2",
        question:
          "At what debt-to-income ratio do financial experts consider debt a danger zone?",
        options: ["Above 10%", "Above 20%", "Above 40%", "Above 60%"],
        correctIndex: 2,
        explanation:
          "Monthly debt payments exceeding 40% of gross income are considered a danger zone, significantly limiting financial flexibility.",
      },
    ],
  },

  // ── 5. Investing Basics ────────────────────────────────────────────────────
  {
    id: "lesson-investing",
    topic: "investing",
    title: "Investing Basics: Making Money Work While You Sleep",
    objective:
      "Understand the core principles of investing and why starting early matters far more than the amount.",
    estimatedMinutes: 3,
    defaultOrder: 5,
    content: `## Why Invest?

Inflation erodes the purchasing power of idle cash. ₹1,00,000 today may only buy what ₹60,000 buys in 10 years at 5% inflation. Investing is how you stay ahead.

## Compound Interest: The Eighth Wonder

Compound interest means earning returns on your returns.

- **₹5,000/month invested at 12% for 30 years → ₹1.76 crore**
- **₹5,000/month invested at 12% for 20 years → ₹49 lakh**

The 10-year difference (at the same monthly amount) more than triples the outcome. **Starting early is the single most powerful thing you can do.**

## Core Investment Options in India

| Instrument | Risk | Return (approx) | Best For |
|---|---|---|---|
| FD | Very Low | 5–7% | Emergency fund, capital preservation |
| Liquid MF | Low | 6–7% | Short-term parking |
| Debt MF | Low–Mod | 7–9% | Medium-term goals |
| PPF | Low | 7.1% | Tax-saving, 15-year horizon |
| Index Fund (Nifty 50) | Moderate | 11–13% | Long-term wealth creation |
| Direct Equity | High | Variable | Advanced investors |

## Start With Index Funds

For most beginners, a simple SIP (Systematic Investment Plan) in a Nifty 50 or Nifty 500 index fund is the ideal starting point. Low cost, diversified, no stock-picking needed.

## The Rule of 72

Divide 72 by your annual return rate to find how many years it takes to double your money.
- At 8% → 9 years to double
- At 12% → 6 years to double`,
    keyTakeaways: [
      "Investing protects purchasing power against inflation.",
      "Compound interest rewards early starters enormously.",
      "Index funds are a low-cost, diversified starting point.",
      "Even small monthly amounts compound into significant wealth.",
    ],
    quiz: [
      {
        id: "iq1",
        question: "Using the Rule of 72, how long does it take to double money invested at 12% annual returns?",
        options: ["4 years", "6 years", "8 years", "12 years"],
        correctIndex: 1,
        explanation:
          "72 ÷ 12 = 6 years. The Rule of 72 is a quick mental math shortcut for estimating investment doubling time.",
      },
      {
        id: "iq2",
        question: "Which investment is generally most suitable for a beginner building long-term wealth?",
        options: [
          "Individual company stocks",
          "Fixed deposits only",
          "Index funds via SIP",
          "Cryptocurrency",
        ],
        correctIndex: 2,
        explanation:
          "Index funds via SIP offer automatic diversification, low fees, and historically strong long-term returns — ideal for beginners.",
      },
    ],
  },

  // ── 6. Financial Goal Planning ─────────────────────────────────────────────
  {
    id: "lesson-goal-planning",
    topic: "goal_planning",
    title: "Financial Goal Planning: From Dreams to Funded Milestones",
    objective:
      "Learn to convert vague financial aspirations into specific, funded, time-bound goals.",
    estimatedMinutes: 3,
    defaultOrder: 6,
    content: `## Why Goals Beat Resolutions

"I want to save more" is a resolution. "I will save ₹3,000 per month for 18 months to fund a ₹54,000 emergency fund by December 2026" is a goal.

Goals have amounts, timelines, and dedicated accounts. Resolutions have good intentions.

## The SMART Goal Framework

- **S**pecific: What exactly do you want to achieve?
- **M**easurable: How will you know you've succeeded?
- **A**chievable: Is it realistic given your income?
- **R**elevant: Does it align with your life priorities?
- **T**ime-bound: By when?

## Categorizing Goals by Time Horizon

| Horizon | Examples | Best Instruments |
|---|---|---|
| Short-term (< 1 yr) | Emergency fund, vacation | Savings account, liquid MF |
| Medium-term (1–5 yr) | Down payment, car | Debt MF, FD, RD |
| Long-term (5+ yr) | Retirement, child education | Equity index funds, PPF |

## The Goal-Based Investing Approach

Assign each savings or investment account to exactly one goal. Don't mix short-term and long-term money. When you see your "Home Down Payment Fund" growing, you stay motivated.

## Working Backwards

If your goal is ₹5,00,000 in 5 years and you expect 10% returns:
Monthly SIP needed ≈ ₹6,500/month.

Always calculate the monthly contribution required — then verify it fits your budget.`,
    keyTakeaways: [
      "Goals must be specific, measurable, and time-bound.",
      "Match investment instruments to goal time horizons.",
      "Assign separate accounts to separate goals.",
      "Work backwards from the target to find the monthly amount needed.",
    ],
    quiz: [
      {
        id: "gq1",
        question:
          "Which of the following best represents a SMART financial goal?",
        options: [
          "I want to save more money this year",
          "I will save ₹5,000/month for 12 months to build a ₹60,000 emergency fund",
          "I should invest sometime in the future",
          "I want to be rich",
        ],
        correctIndex: 1,
        explanation:
          "The second option is Specific (₹60,000 emergency fund), Measurable (₹5,000/month), Achievable, Relevant, and Time-bound (12 months).",
      },
      {
        id: "gq2",
        question: "Which instrument is most appropriate for a 1-year savings goal?",
        options: [
          "Nifty 50 index fund",
          "Direct equity stocks",
          "Liquid mutual fund or FD",
          "Real estate",
        ],
        correctIndex: 2,
        explanation:
          "Short-term goals need stability and liquidity. Equity instruments can be volatile over 1-year horizons, making liquid funds or FDs more appropriate.",
      },
    ],
  },

  // ── 7. Insurance Essentials ────────────────────────────────────────────────
  {
    id: "lesson-insurance",
    topic: "insurance",
    title: "Insurance Essentials: Protecting What You've Built",
    objective:
      "Understand the purpose of insurance and identify which policies are genuinely necessary.",
    estimatedMinutes: 3,
    defaultOrder: 7,
    content: `## Insurance Is Risk Transfer

You pay a premium to transfer a low-probability, high-impact risk (death, serious illness, accident) to an insurer. Insurance is not an investment — it's protection.

Mixing insurance and investment (endowment plans, ULIPs) almost always delivers poor returns on both. Keep them separate.

## Term Life Insurance

**Who needs it:** Anyone with financial dependents (spouse, children, parents).
**How much:** 10–15× your annual income.
**Best form:** Pure term plan — maximum cover at minimum cost.

A ₹1 crore term plan for a 30-year-old can cost ₹8,000–₹12,000/year. The same cover via an endowment plan costs 10–15× more.

## Health Insurance

Medical costs are the #1 cause of financial ruin in India for the middle class. A ₹5–₹10 lakh family floater health policy is non-negotiable.

**Key checks when buying:**
- Network hospitals near you
- Pre-existing disease waiting period
- No-claim bonus
- Room rent limits (avoid sub-limits)

## What to Avoid

- **Endowment / money-back plans:** Poor returns, high premiums.
- **ULIPs:** High charges in the first 3–5 years.
- **Credit card insurance add-ons:** Rarely provide meaningful cover.

## Priority Order

1. Health insurance (immediate)
2. Term life (if you have dependents)
3. Vehicle insurance (mandatory)
4. Home/contents insurance (if applicable)`,
    keyTakeaways: [
      "Insurance transfers risk — it is not an investment.",
      "Buy a pure term plan, not endowment or ULIP.",
      "Health insurance is non-negotiable for every earning adult.",
      "Keep insurance and investment in separate products.",
    ],
    quiz: [
      {
        id: "insq1",
        question: "What is the primary purpose of insurance?",
        options: [
          "To generate investment returns",
          "To save on taxes",
          "To transfer the financial risk of high-impact events",
          "To build a retirement corpus",
        ],
        correctIndex: 2,
        explanation:
          "Insurance is a risk-transfer mechanism. You pay a premium so that a catastrophic event doesn't financially devastate you or your family.",
      },
      {
        id: "insq2",
        question: "Why do financial experts recommend pure term plans over endowment plans?",
        options: [
          "Term plans are government-mandated",
          "Endowment plans don't cover death",
          "Term plans provide maximum cover at the lowest cost with no investment mixing",
          "Endowment plans are only for senior citizens",
        ],
        correctIndex: 2,
        explanation:
          "Pure term plans separate insurance from investment, offering far higher coverage for a fraction of the premium. Endowment plans dilute both functions.",
      },
    ],
  },

  // ── 8. Digital Payments & Financial Safety ────────────────────────────────
  {
    id: "lesson-digital-safety",
    topic: "digital_safety",
    title: "Digital Payments & Financial Safety: Protecting Your Money Online",
    objective:
      "Learn to use digital payment tools confidently while recognizing and avoiding common financial frauds.",
    estimatedMinutes: 3,
    defaultOrder: 8,
    content: `## The Rise of Digital Finance

India is one of the world's leaders in digital payments — UPI, NEFT, IMPS, and mobile wallets process billions of transactions daily. This convenience brings risk.

## Core Safety Habits

**UPI & Mobile Banking:**
- Never share your UPI PIN, OTP, or bank password with anyone — including "bank officials."
- Use different PINs for different apps.
- Set daily transfer limits on your UPI apps.
- Review your bank statement monthly for unrecognized charges.

**Passwords:**
- Use a password manager.
- Enable two-factor authentication (2FA) on all financial accounts.
- Never use the same password across banking and non-banking sites.

## Common Frauds and How to Spot Them

| Fraud Type | Red Flag | What to Do |
|---|---|---|
| SIM swap | Phone stops working suddenly | Call operator immediately |
| Phishing call | "Your KYC has expired" | Hang up; call bank directly |
| Fake payment QR | Request to scan QR to receive money | Legitimate payment never requires scanning to receive |
| Lottery/prize scam | "You've won — pay a fee to claim" | Zero legitimate prize requires upfront payment |

## Credit Score — Your Financial Reputation

Your CIBIL score (300–900) affects your access to loans and their interest rates.
- **750+:** Excellent — best loan rates
- **650–749:** Good
- **Below 600:** Difficult to get credit

Check it free once a year at CIBIL or via apps like OneScore.`,
    keyTakeaways: [
      "Never share OTP, PIN, or password — no legitimate entity asks.",
      "Scanning a QR code always sends money; it never receives it.",
      "Enable 2FA on all financial accounts.",
      "A credit score above 750 unlocks the best loan rates.",
    ],
    quiz: [
      {
        id: "dsq1",
        question:
          "A caller claims to be from your bank and asks for your OTP to 'verify your account'. What should you do?",
        options: [
          "Share the OTP since they're from the bank",
          "Hang up immediately — banks never ask for OTPs",
          "Share only the first 3 digits",
          "Call the number they provide to verify",
        ],
        correctIndex: 1,
        explanation:
          "No legitimate bank, government body, or financial institution ever asks for your OTP over a phone call. This is a phishing fraud — hang up immediately.",
      },
      {
        id: "dsq2",
        question: "In UPI, when do you need to enter your PIN?",
        options: [
          "When receiving money",
          "When sending money",
          "Both sending and receiving",
          "Only for amounts above ₹1,000",
        ],
        correctIndex: 1,
        explanation:
          "Your UPI PIN is only entered when you're authorizing a payment (sending money). Receiving money never requires a PIN — scammers often exploit this confusion.",
      },
    ],
  },

  // ── 9. Spending Psychology ─────────────────────────────────────────────────
  {
    id: "lesson-spending-psychology",
    topic: "spending_psychology",
    title: "Spending Psychology: Why We Overspend and How to Stop",
    objective:
      "Recognize the psychological triggers behind impulsive spending and develop practical countermeasures.",
    estimatedMinutes: 3,
    defaultOrder: 9,
    content: `## Your Brain on Spending

Spending activates the brain's reward system — the same pathways involved in eating and social bonding. Retailers and app designers have spent billions studying how to exploit this.

Understanding the mechanisms is the first step to resisting them.

## Key Psychological Traps

**1. The Decoy Effect**
When a product at ₹2,000 is shown next to a premium version at ₹6,000, the ₹2,000 item feels like a bargain — even if you only needed the ₹800 option.

**2. Anchoring**
The first price you see becomes the reference point. "Was ₹5,000, now ₹2,499" makes ₹2,499 feel cheap, even if the item's fair value is ₹1,200.

**3. The Endowment Effect**
Once you've mentally "owned" something (added to cart, tried it on), you value it more and find it harder to put back.

**4. Social Comparison / FOMO**
Spending triggered by what peers own or experiences shared on social media. "Keeping up with the Joneses" is more powerful online than ever.

**5. Retail Therapy**
Using purchases as emotional regulation — shopping to feel better when stressed, anxious, or bored.

## Countermeasures That Work

- **The 24-hour rule:** For any non-essential purchase above a threshold (e.g., ₹1,000), wait 24 hours before buying. Impulse passes.
- **Wishlist method:** Add items to a wishlist instead of the cart. Review the list weekly.
- **No-spend categories:** Pick one category per month to cut entirely.
- **Unsubscribe from marketing emails:** Reducing exposure reduces temptation.`,
    keyTakeaways: [
      "Overspending is engineered by retailers — it's not purely your fault.",
      "The 24-hour rule eliminates most impulse purchases.",
      "Social comparison is a major spending trigger; curate your feed.",
      "Identifying your emotional spending triggers is the first step to changing them.",
    ],
    quiz: [
      {
        id: "spq1",
        question: "What is the purpose of the 24-hour rule in spending?",
        options: [
          "To give sellers time to process your order",
          "To allow time for price comparisons online",
          "To let the impulse to buy fade before making a non-essential purchase",
          "Required by consumer protection law",
        ],
        correctIndex: 2,
        explanation:
          "The 24-hour rule exploits the fact that impulse purchases are driven by emotion, not logic. Waiting a day allows rational thinking to override the urge to spend.",
      },
      {
        id: "spq2",
        question: "What is 'anchoring' in the context of pricing?",
        options: [
          "When a product is available only at one store",
          "When the first price seen becomes the reference point for judging value",
          "When a product is linked to a popular brand",
          "When prices are fixed by the government",
        ],
        correctIndex: 1,
        explanation:
          "Anchoring is a cognitive bias where the first piece of information encountered (the anchor price) heavily influences all subsequent judgments of value.",
      },
    ],
  },

  // ── 10. Becoming Financially Independent ──────────────────────────────────
  {
    id: "lesson-financial-independence",
    topic: "financial_independence",
    title: "Financial Independence: The Freedom to Choose Your Work",
    objective:
      "Understand what financial independence means and how to build a path toward it regardless of income level.",
    estimatedMinutes: 3,
    defaultOrder: 10,
    content: `## What Is Financial Independence?

Financial independence (FI) is the point where your investments generate enough passive income to cover your living expenses — meaning work becomes a choice, not a necessity.

You don't have to be wealthy to pursue FI. You need a gap between income and expenses, and the discipline to invest the difference consistently.

## The FIRE Number

Your FI target is typically **25× your annual expenses** (based on the 4% safe withdrawal rate — the rate at which a portfolio historically sustains withdrawals indefinitely).

**Annual expenses:** ₹6,00,000/year
**FI target:** ₹1,50,00,000 (₹1.5 crore)

## The Three Levers

1. **Increase income:** Skills, side income, career progression
2. **Decrease expenses:** Eliminate unnecessary spending
3. **Invest the gap:** The bigger the gap, the faster you reach FI

All three levers are interconnected. The most efficient path uses all three.

## The Progression Path

| Stage | What You've Built |
|---|---|
| Financial Fragility | No savings, living paycheck to paycheck |
| Financial Stability | 1–3 months emergency fund, no high-interest debt |
| Financial Security | 3–6 months fund, regular investments started |
| Financial Independence | Investment income covers expenses |

Most people spend their entire lives at Stability. The goal is to keep moving.

## It's Not About the Number

Financial independence gives you **optionality** — the ability to work on things you care about, take risks, say no, and design your lifestyle intentionally.

Start now. The best day was 10 years ago. The second best day is today.`,
    keyTakeaways: [
      "Financial independence means your investments cover your expenses.",
      "FI target ≈ 25× annual expenses (4% withdrawal rule).",
      "Three levers: earn more, spend less, invest the difference.",
      "Start wherever you are — every step moves you closer.",
    ],
    quiz: [
      {
        id: "fiq1",
        question:
          "If your annual living expenses are ₹5,00,000, what is your approximate financial independence target using the 4% rule?",
        options: ["₹50 lakh", "₹1 crore", "₹1.25 crore", "₹2 crore"],
        correctIndex: 2,
        explanation:
          "₹5,00,000 × 25 = ₹1,25,00,000 (₹1.25 crore). The 4% safe withdrawal rate means you need 25× annual expenses to safely withdraw indefinitely.",
      },
      {
        id: "fiq2",
        question: "What does 'financial independence' truly provide?",
        options: [
          "Guaranteed luxury lifestyle",
          "Freedom to never work again",
          "Optionality — the ability to choose your work and life on your own terms",
          "Immunity from inflation",
        ],
        correctIndex: 2,
        explanation:
          "Financial independence is about optionality, not idleness. Most FI individuals continue to work — but on their own terms, doing work they find meaningful.",
      },
    ],
  },
];

// Convenience map: lessonId → Lesson
export const LESSON_MAP = new Map<string, Lesson>(
  LESSONS.map((l) => [l.id, l]),
);
