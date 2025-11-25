import { useProject } from '../../contexts/ProjectContext';
import { COLORS, FONTS, SPACING, BORDERS, STYLE_PRESETS } from '../../styles/theme';

const SmartStartTab = () => {
  const { switchTab } = useProject();

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Hero Section */}
      <div style={STYLE_PRESETS.heroGoldGradient}>
        <h1 style={{ ...STYLE_PRESETS.heroTitle, color: COLORS.gold.dark }}>
          ⚡ SmartStart: The $10K Decision That Saves You $50K–$150K
        </h1>
        <p style={{ ...STYLE_PRESETS.heroSubtitle, color: COLORS.gold.dark }}>
          Know everything in 4-6 weeks. Avoid 6 months of guesswork. Build from strength.
        </p>
      </div>

      {/* Impact Banner */}
      <div style={STYLE_PRESETS.impactBanner}>
        <p style={{ ...STYLE_PRESETS.impactHeading, color: COLORS.white }}>
          SmartStart pays for itself before you even break ground. Every time.
        </p>
        <p style={{ ...STYLE_PRESETS.impactSubheading, color: COLORS.lightGreen }}>
          $40K–$90K in immediate savings + 10–20× ROI on factory-side optimization
        </p>
      </div>

      {/* Why Developers Fail */}
      <div style={STYLE_PRESETS.heroRedGradient}>
        <h2 style={{ ...STYLE_PRESETS.sectionTitle, color: COLORS.red.dark }}>
          Why Modular Projects Fail
        </h2>
        <p style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold, color: COLORS.red.text, textAlign: 'center', margin: '0px', lineHeight: '1.7', fontFamily: FONTS.system }}>
          <strong>Reason 1:</strong> Bad pricing (±20% estimates) → cost creep kills the deal<br/>
          <strong>Reason 2:</strong> Bad design (not modular-optimized) → factory rework delays everything<br/>
          <strong>SmartStart fixes both—before they can hurt you.</strong>
        </p>
      </div>

      {/* Three-Panel Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: SPACING.lg, marginBottom: SPACING['3xl'] }}>
        {/* Panel 1: Know in 4-6 Weeks */}
        <div style={STYLE_PRESETS.panelCardBlue}>
          <div style={STYLE_PRESETS.emojiIcon}>⏱️</div>
          <h3 style={{ ...STYLE_PRESETS.panelTitle, color: COLORS.blue.dark }}>
            Know in 4-6 Weeks
          </h3>
          <p style={{ ...STYLE_PRESETS.panelSubtitle, color: COLORS.blue.text }}>
            Certainty Before Capital
          </p>
          <ul style={{ ...STYLE_PRESETS.listContainer, color: COLORS.blue.text }}>
            <li>✓ Firm modular cost</li>
            <li>✓ Fabrication-ready design</li>
            <li>✓ Entitlement-ready package</li>
          </ul>
          <div style={{ ...STYLE_PRESETS.panelFooter, borderTop: `2px solid ${COLORS.blue.main}`, color: COLORS.blue.dark }}>
            4-6 weeks → answers you normally wait 4–6 months for
          </div>
        </div>

        {/* Panel 2: Save 20× */}
        <div style={STYLE_PRESETS.panelCardGold}>
          <div style={STYLE_PRESETS.emojiIcon}>💰</div>
          <h3 style={{ ...STYLE_PRESETS.panelTitle, color: COLORS.gold.dark }}>
            Save 20× Your Spend
          </h3>
          <p style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.black, color: COLORS.gold.main, marginBottom: SPACING.md, textAlign: 'center', fontFamily: FONTS.system }}>
            $10K → $50K–$150K Saved
          </p>
          <ul style={{ ...STYLE_PRESETS.listContainer, color: COLORS.gold.text }}>
            <li>✓ No rework during entitlement</li>
            <li>✓ No redesign at factory</li>
            <li>✓ No ±20% cost creep</li>
          </ul>
          <div style={{ ...STYLE_PRESETS.panelFooter, borderTop: `2px solid ${COLORS.gold.main}`, color: COLORS.gold.dark }}>
            Removes the two biggest killers of modular deals
          </div>
        </div>

        {/* Panel 3: Negotiate from Strength */}
        <div style={STYLE_PRESETS.panelCardGreen}>
          <div style={STYLE_PRESETS.emojiIcon}>🤝</div>
          <h3 style={{ ...STYLE_PRESETS.panelTitle, color: COLORS.green.dark }}>
            Negotiate from Strength
          </h3>
          <p style={{ ...STYLE_PRESETS.panelSubtitle, color: COLORS.green.medium }}>
            Real Bids. Real Numbers. Real Partners.
          </p>
          <ul style={{ ...STYLE_PRESETS.listContainer, color: COLORS.green.medium }}>
            <li>✓ 3–5 GC/Fabricator firm bids</li>
            <li>✓ Scope + terms aligned early</li>
            <li>✓ Bank-ready budget</li>
          </ul>
          <div style={{ ...STYLE_PRESETS.panelFooter, borderTop: `2px solid ${COLORS.green.light}`, color: COLORS.green.dark }}>
            Start entitlement with leverage—not guesswork
          </div>
        </div>
      </div>

      {/* The SmartStart Equation */}
      <div style={STYLE_PRESETS.heroGreenGradient}>
        <h2 style={{ ...STYLE_PRESETS.sectionTitle, color: COLORS.green.dark }}>
          The SmartStart Equation
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.lg, flexWrap: 'wrap', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.black, color: COLORS.green.dark, fontFamily: FONTS.system }}>
          <div style={{ padding: `${SPACING.md} ${SPACING.lg}`, background: COLORS.gold.bg, borderRadius: BORDERS.radius.md, border: `${BORDERS.width.normal} solid ${COLORS.gold.main}`, minWidth: '100px', textAlign: 'center' }}>
            $10K
          </div>
          <div style={{ fontSize: FONTS.sizes['6xl'] }}>→</div>
          <div style={{ padding: `${SPACING.md} ${SPACING.lg}`, background: COLORS.green.bg, borderRadius: BORDERS.radius.md, border: `${BORDERS.width.normal} solid ${COLORS.green.light}`, minWidth: '140px', textAlign: 'center', fontSize: FONTS.sizes.md }}>
            Firm Design<br/>+ Firm Price
          </div>
          <div style={{ fontSize: FONTS.sizes['6xl'] }}>→</div>
          <div style={{ padding: `${SPACING.md} ${SPACING.lg}`, background: COLORS.blue.bg, borderRadius: BORDERS.radius.md, border: `${BORDERS.width.normal} solid ${COLORS.blue.main}`, minWidth: '120px', textAlign: 'center' }}>
            $50K–$150K<br/>Savings
          </div>
          <div style={{ fontSize: FONTS.sizes['6xl'] }}>→</div>
          <div style={{ padding: `${SPACING.md} ${SPACING.lg}`, background: COLORS.red.bg, borderRadius: BORDERS.radius.md, border: `${BORDERS.width.normal} solid ${COLORS.red.main}`, minWidth: '110px', textAlign: 'center', fontSize: FONTS.sizes.md }}>
            Zero Surprises<br/>+ Fast Approval
          </div>
          <div style={{ fontSize: FONTS.sizes['6xl'] }}>→</div>
          <div style={{ padding: `${SPACING.md} ${SPACING.lg}`, background: COLORS.green.bg, borderRadius: BORDERS.radius.md, border: `${BORDERS.width.thick} solid ${COLORS.green.light}`, minWidth: '130px', textAlign: 'center', fontWeight: FONTS.weight.black, fontSize: `${FONTS.sizes.base}px` }}>
            Modular<br/>Success ✅
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={STYLE_PRESETS.ctaSection}>
        <p style={{ fontSize: FONTS.sizes['5xl'], fontWeight: FONTS.weight.black, color: COLORS.white, margin: `0 0 ${SPACING.md} 0`, lineHeight: '1.3', fontFamily: FONTS.system }}>
          Ready to Know Everything in 4-6 Weeks?
        </p>
        <p style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold, color: COLORS.lightGreen, margin: '0px', fontFamily: FONTS.system }}>
          Your cost savings will exceed what you pay us. Guaranteed.
        </p>
      </div>
    </div>
  );
};

export default SmartStartTab;
