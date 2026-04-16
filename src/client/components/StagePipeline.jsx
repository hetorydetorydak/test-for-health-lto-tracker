import React from 'react';
import './components.css';

/**
 * StagePipeline — Horizontal stepper showing license renewal progression
 * @param {string} currentStage - 'not_started' | 'documents_gathering' | 'submitted_to_doh' | 'under_evaluation' | 'released'
 * @param {function} onAdvance - callback when user clicks "Advance Stage" button
 * @param {boolean} canAdvance - whether the advance button should be enabled
 */
export function StagePipeline({ currentStage = 'not_started', onAdvance = null, canAdvance = false }) {
  const stages = [
    { key: 'not_started', label: 'Not Started', step: 0 },
    { key: 'documents_gathering', label: 'Documents Gathering', step: 1 },
    { key: 'submitted_to_doh', label: 'Submitted to DOH', step: 2 },
    { key: 'under_evaluation', label: 'Under Evaluation', step: 3 },
    { key: 'released', label: 'Released', step: 4 },
  ];

  const currentStep = stages.find((s) => s.key === currentStage)?.step || 0;

  return (
    <div className="stage-pipeline">
      <div className="stage-pipeline__stepper">
        {stages.map((stage, idx) => {
          const isCompleted = stage.step < currentStep;
          const isCurrent = stage.step === currentStep;

          return (
            <div key={stage.key} className="stage-pipeline__stage-group">
              {/* Circle Node */}
              <div
                className={`stage-pipeline__node stage-pipeline__node--${
                  isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
                }`}
                title={stage.label}
              >
                <div className="stage-pipeline__node-inner" />
              </div>

              {/* Label below node */}
              <div
                className={`stage-pipeline__label ${isCurrent ? 'stage-pipeline__label--active' : ''}`}
              >
                {stage.label}
              </div>

              {/* Connector (except after last stage) */}
              {idx < stages.length - 1 && (
                <div
                  className={`stage-pipeline__connector ${
                    isCompleted ? 'stage-pipeline__connector--completed' : ''
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Advance Button (admin only) */}
      {onAdvance && canAdvance && currentStep < 4 && (
        <div className="stage-pipeline__action">
          <button className="stage-pipeline__advance-btn" onClick={onAdvance}>
            ➡️ Advance Stage
          </button>
        </div>
      )}
    </div>
  );
}

export default StagePipeline;
