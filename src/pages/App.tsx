/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouterProvider, RouterView } from 'src/router/context';
import router from 'src/router';

export default function App() {
  const { t, i18n } = useTranslation();
  const handleSwitch = async () => {
    await i18n.changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN');
  };
  return (
    <>
      <RouterProvider value={router}>
        <HashRouter>
          <RouterView />
        </HashRouter>
      </RouterProvider>
    </>
  );
}
