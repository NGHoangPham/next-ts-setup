import { FC } from 'react';
import styles from './styles.module.css';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setLanguage, setLanguageType } from 'store/ducks/system/slice';
import { LANGUAGE } from 'utils/constant';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'components/Dropdown';
import { useRouter } from 'next/router';

const normalizeLangCode = (langCode: string) => langCode?.split('-')[0].toUpperCase() || '';

export const LanguageSelect: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { language } = useAppSelector((state) => state.system);

  const onChangeLanguage = (language: string) => {
    dispatch(setLanguage(language));
    dispatch(setLanguageType());
    router.replace({ pathname, query }, asPath, { locale: language });
  };

  const languageMenu = (
    <Menu>
      {LANGUAGE.map((language) => (
        <Menu.Item key={language} onClick={() => onChangeLanguage(language)}>
          {normalizeLangCode(language)}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={languageMenu}>
      <p className="mb-0 cursor">
        {normalizeLangCode(language)}
        <FontAwesomeIcon className={styles.downOutline} icon={faChevronDown} />
      </p>
    </Dropdown>
  );
};
