import React, { useState } from 'react';

const noImage = '/static/images/no-image.jpg';

const Image = (props: any) => {
  const [error, setError] = useState(false);
  if (error) return <img {...props} ref={props.refs} src={noImage} alt={props.alt || ''} />;
  return <img {...props} ref={props.refs} onError={() => setError(true)} alt={props.alt || ''} />;
};

export default Image;
