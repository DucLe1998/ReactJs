import React from 'react';

const LabelInput = ({ label }) => {
  if (label) {
    const checkLabelRequire = label.search('[*|]');
    return (
      <>
        {label && (
          <div className="custom-label-imput">
            {checkLabelRequire !== -1 ? (
              <div>
                {label.replaceAll('*', '')}{' '}
                <span style={{ color: 'red' }}>*</span>
              </div>
            ) : (
              label
            )}
          </div>
        )}
      </>
    );
  }
  return null;
};

export default LabelInput;
