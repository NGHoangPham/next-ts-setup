import { FC } from 'react';
import styles from './styles.module.css';
// import { useAppDispatch, useAppSelector } from 'hooks';
// import { setLanguage, setLanguageType } from 'store/ducks/system/slice';
import { LANGUAGE } from 'utils/constant';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'components/Dropdown';
import { useRouter } from 'next/router';

export const LanguageSelect: FC = () => {
  // const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  // const { language } = useAppSelector((state) => state.system);

  const onChangeLanguage = (lang: string) => {
    // dispatch(setLanguage(lang));
    // dispatch(setLanguageType());
    router.replace({ pathname, query }, asPath, { locale: lang });
  };

  const languageMenu = (
    <Menu>
      {LANGUAGE.map((lang) => (
        <Menu.Item className="uppercase" key={lang} onClick={() => onChangeLanguage(lang)}>
          {lang}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={languageMenu}>
      <p className="mb-0 cursor uppercase">
        {locale}
        <FontAwesomeIcon className={styles.downOutline} icon={faChevronDown} />
      </p>
    </Dropdown>
  );
};
