import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const MyAccountPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('myAccount.title'));

  return <div>My Account Page</div>;
};
export default MyAccountPage;
