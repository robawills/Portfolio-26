import * as React from 'react';

// eslint-disable-next-line react/display-name
const SvgrMock = React.forwardRef((props, ref) => (
  <svg ref={ref} {...props} snapshotnote="SVG" />
));

export const ReactComponent = SvgrMock;
export default SvgrMock;
