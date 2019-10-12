import React from 'react';
import i18n from 'i18n-js';
import EmptyText from './EmptyText';
import { Button } from './UI';

export default function ErrorMessage({ text, isVisible, retry }) {
  if (isVisible) {
    return (
      <EmptyText
        isVisible
        FooterComponent={
          retry
            ? () => <Button onPress={retry} title={i18n.t('retry')} />
            : null
        }
      >
        {text || i18n.t('error_loading')}
      </EmptyText>
    );
  }
  return null;
}
