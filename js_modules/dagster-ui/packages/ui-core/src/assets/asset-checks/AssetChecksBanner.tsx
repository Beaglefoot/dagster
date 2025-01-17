import {Alert, Colors, Icon} from '@dagster-io/ui-components';
import React from 'react';

export const AssetChecksBanner = () => {
  return (
    <Alert
      intent="info"
      title="Asset Checks are still experimental"
      icon={<Icon name="info" color={Colors.Blue700} />}
      description={
        <span>
          You can learn more about this new feature and provide feedback{' '}
          <a href="https://github.com/dagster-io/dagster/discussions/15880">here</a>.
        </span>
      }
    />
  );
};
