import { useState } from 'react';
import { COLORS, FONTS, SPACING } from '../styles/theme';

const GanttChart = ({ raapStart, raapEnd, aorStart, aorEnd, raapActivity, aorActivity }) => {
  const maxEnd = Math.max(raapEnd, aorEnd);
  const totalWeeks = maxEnd;

  const getBarStyle = (startWeek, endWeek, color) => {
    const startPercent = (startWeek / totalWeeks) * 100;
    const widthPercent = ((endWeek - startWeek) / totalWeeks) * 100;

    return {
      left: `${startPercent}%`,
      width: `${Math.max(widthPercent, 3)}%`,
      background: color,
      height: '24px',
      borderRadius: '3px',
      position: 'absolute',
      top: '0',
      transition: 'all 0.2s'
    };
  };

  return (
    <div style={{ marginTop: SPACING.lg, padding: SPACING.lg, background: '#f9fafb', borderRadius: '8px' }}>
      <h4 style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gray.dark, marginBottom: SPACING.md }}>
        📅 Timeline
      </h4>

      {/* Week Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`, gap: '2px', marginBottom: SPACING.lg, fontSize: FONTS.sizes.xs, textAlign: 'center', color: COLORS.gray.medium, fontWeight: FONTS.weight.bold }}>
        {Array.from({ length: totalWeeks }).map((_, i) => (
          <div key={i} style={{ padding: '4px', background: 'white', borderRadius: '3px', border: `1px solid ${COLORS.gray.light}` }}>
            W{i}
          </div>
        ))}
      </div>

      {/* RaaP Timeline */}
      <div style={{ marginBottom: SPACING.lg, display: 'grid', gridTemplateColumns: '80px 1fr 160px', gap: SPACING.md, alignItems: 'flex-start' }}>
        <div style={{ fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.blue.dark, paddingTop: '4px' }}>🏭 RaaP</div>
        <div style={{ position: 'relative', height: '24px', paddingTop: '4px' }}>
          <div style={getBarStyle(raapStart, raapEnd, COLORS.blue.main)} />
        </div>
        {raapActivity && (
          <div style={{ fontSize: FONTS.sizes.sm, color: COLORS.gray.dark, lineHeight: '1.3', wordBreak: 'break-word' }}>
            {raapActivity}
          </div>
        )}
      </div>

      {/* AoR Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 160px', gap: SPACING.md, alignItems: 'flex-start' }}>
        <div style={{ fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: '#1a1a1a', paddingTop: '4px' }}>🏗️ AoR</div>
        <div style={{ position: 'relative', height: '24px', paddingTop: '4px' }}>
          <div style={getBarStyle(aorStart, aorEnd, '#000000')} />
        </div>
        {aorActivity && (
          <div style={{ fontSize: FONTS.sizes.sm, color: COLORS.gray.dark, lineHeight: '1.3', wordBreak: 'break-word' }}>
            {aorActivity}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageGridExpander = ({ images }) => {
  const [expandedId, setExpandedId] = useState(null);
  const expandedImage = images.find(img => img.id === expandedId);

  if (expandedImage) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out',
          padding: SPACING.lg,
          overflowY: 'auto'
        }}
        onClick={() => setExpandedId(null)}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: SPACING['2xl'],
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <h2 style={{ fontSize: FONTS.sizes.xl, fontWeight: FONTS.weight.black, color: COLORS.blue.dark, margin: 0 }}>
              {expandedImage.title}
            </h2>
            <button
              onClick={() => setExpandedId(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: COLORS.gray.medium,
                padding: 0,
                transition: 'color 0.2s'
              }}
              onMouseOver={e => e.target.style.color = COLORS.gray.dark}
              onMouseOut={e => e.target.style.color = COLORS.gray.medium}
            >
              ✕
            </button>
          </div>

          {/* Comparison Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: SPACING.lg }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${COLORS.green.bg} 0%, ${COLORS.blue.bg} 100%)`, borderBottom: `2px solid ${COLORS.green.dark}` }}>
                <th style={{ padding: SPACING.md, textAlign: 'left', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.sm, color: COLORS.green.dark }}>🏭 RaaP</th>
                <th style={{ padding: SPACING.md, textAlign: 'left', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.sm, color: COLORS.blue.dark }}>🏗️ AoR</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${COLORS.gray.light}`, background: 'white' }}>
                <td style={{ padding: SPACING.md, textAlign: 'left', fontSize: FONTS.sizes.sm, color: COLORS.gray.dark, verticalAlign: 'top', lineHeight: '1.8' }}>
                  <div style={{ paddingLeft: '16px', textIndent: '-16px' }}>
                    <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> {expandedImage.raapScope}
                  </div>
                </td>
                <td style={{ padding: SPACING.md, textAlign: 'left', fontSize: FONTS.sizes.sm, color: COLORS.gray.dark, verticalAlign: 'top', lineHeight: '1.8' }}>
                  <div style={{ paddingLeft: '16px', textIndent: '-16px' }}>
                    <span style={{ color: COLORS.blue.main, fontWeight: FONTS.weight.bold }}>✓</span> {expandedImage.aorScope}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Gantt Chart */}
          <GanttChart
            raapStart={expandedImage.raapStart}
            raapEnd={expandedImage.raapEnd}
            aorStart={expandedImage.aorStart}
            aorEnd={expandedImage.aorEnd}
            raapActivity={expandedImage.raapActivity}
            aorActivity={expandedImage.aorActivity}
          />
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SPACING.lg, marginBottom: SPACING['2xl'] }}>
      {images.map(img => (
        <button
          key={img.id}
          onClick={() => setExpandedId(img.id)}
          style={{
            padding: 0,
            background: 'white',
            border: `2px solid ${COLORS.gray.light}`,
            borderRadius: '12px',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            ':hover': {
              boxShadow: '0 8px 24px rgba(0, 81, 186, 0.15)'
            }
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 81, 186, 0.15)';
            e.currentTarget.style.borderColor = COLORS.blue.main;
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = COLORS.gray.light;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <img
            src={img.image}
            alt={img.title}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ padding: SPACING.md, textAlign: 'center' }}>
            <div style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.blue.dark }}>
              {img.title}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ImageGridExpander;
