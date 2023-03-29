import React from 'react';

const IconDownLoad = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 13V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V13M5 8L10 13M10 13L15 8M10 13V1"
      stroke="#3C3C43"
      strokeOpacity="0.6"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTime = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M0.967773 1.10504L14.846 15.1049"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14.8459 1.10492L0.967739 15.1048"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconEdit = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 18.4404H19"
      stroke="#3C3C43"
      strokeOpacity="0.6"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 1.94066C14.8978 1.54283 15.4374 1.31934 16 1.31934C16.2786 1.31934 16.5544 1.37421 16.8118 1.48081C17.0692 1.58742 17.303 1.74367 17.5 1.94066C17.697 2.13764 17.8532 2.37149 17.9598 2.62886C18.0664 2.88623 18.1213 3.16208 18.1213 3.44066C18.1213 3.71923 18.0664 3.99508 17.9598 4.25245C17.8532 4.50982 17.697 4.74367 17.5 4.94066L5 17.4407L1 18.4407L2 14.4407L14.5 1.94066Z"
      stroke="#3C3C43"
      strokeOpacity="0.6"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDelete = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M1.53406 5.04004H3.57439H19.897"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.63489 5.04043V3.24043C6.63489 2.76304 6.84986 2.3052 7.23249 1.96764C7.61513 1.63007 8.13409 1.44043 8.67522 1.44043H12.7559C13.297 1.44043 13.816 1.63007 14.1986 1.96764C14.5812 2.3052 14.7962 2.76304 14.7962 3.24043V5.04043M17.8567 5.04043V17.6404C17.8567 18.1178 17.6417 18.5757 17.2591 18.9132C16.8765 19.2508 16.3575 19.4404 15.8164 19.4404H5.61473C5.0736 19.4404 4.55464 19.2508 4.172 18.9132C3.78936 18.5757 3.5744 18.1178 3.5744 17.6404V5.04043H17.8567Z"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.67523 9.54004V14.94"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7559 9.54004V14.94"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconSchedule = ({ disabled }) => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0 : 0.8}>
      <path
        d="M6.75 14.8242H4.5C3.70435 14.8242 2.94129 14.5081 2.37868 13.9455C1.81607 13.3829 1.5 12.6199 1.5 11.8242V5.07422C1.5 4.27857 1.81607 3.51551 2.37868 2.9529C2.94129 2.39029 3.70435 2.07422 4.5 2.07422H12.75C13.5456 2.07422 14.3087 2.39029 14.8713 2.9529C15.4339 3.51551 15.75 4.27857 15.75 5.07422V7.32422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 1.32422V2.82422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 1.32422V2.82422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 5.82422H15.75"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.875 11.5566L12.75 12.6816"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 16.3242C14.8211 16.3242 16.5 14.6453 16.5 12.5742C16.5 10.5032 14.8211 8.82422 12.75 8.82422C10.6789 8.82422 9 10.5032 9 12.5742C9 14.6453 10.6789 16.3242 12.75 16.3242Z"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconWarning = ({ disabled }) => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0 : 0.8}>
      <path
        d="M11.7507 8.99862L7.51165 1.20621C6.83058 0.059628 5.17033 0.0581046 4.48835 1.20621L0.249536 8.99862C-0.446698 10.1702 0.396232 11.6539 1.76083 11.6539H10.239C11.6025 11.6539 12.4469 10.1714 11.7507 8.99862ZM6 10.2476C5.61239 10.2476 5.29687 9.93211 5.29687 9.5445C5.29687 9.15689 5.61239 8.84138 6 8.84138C6.38761 8.84138 6.70312 9.15689 6.70312 9.5445C6.70312 9.93211 6.38761 10.2476 6 10.2476ZM6.70312 7.43513C6.70312 7.82274 6.38761 8.13825 6 8.13825C5.61239 8.13825 5.29687 7.82274 5.29687 7.43513V3.9195C5.29687 3.53189 5.61239 3.21638 6 3.21638C6.38761 3.21638 6.70312 3.53189 6.70312 3.9195V7.43513Z"
        fill="#FF0000"
      />
    </g>
  </svg>
);

const IconCalenda = ({ disabled }) => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.5 : 0.8}>
      <path
        d="M6.75 14.8242H4.5C3.70435 14.8242 2.94129 14.5081 2.37868 13.9455C1.81607 13.3829 1.5 12.6199 1.5 11.8242V5.07422C1.5 4.27857 1.81607 3.51551 2.37868 2.9529C2.94129 2.39029 3.70435 2.07422 4.5 2.07422H12.75C13.5456 2.07422 14.3087 2.39029 14.8713 2.9529C15.4339 3.51551 15.75 4.27857 15.75 5.07422V7.32422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 1.32422V2.82422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 1.32422V2.82422"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 5.82422H15.75"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.875 11.5566L12.75 12.6816"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 16.3242C14.8211 16.3242 16.5 14.6453 16.5 12.5742C16.5 10.5032 14.8211 8.82422 12.75 8.82422C10.6789 8.82422 9 10.5032 9 12.5742C9 14.6453 10.6789 16.3242 12.75 16.3242Z"
        stroke="#3C3C43"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconCalendaGreen = ({ disabled }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.5 : 1}>
      <path
        d="M9 20H6C4.93913 20 3.92172 19.5786 3.17157 18.8284C2.42143 18.0783 2 17.0609 2 16V7C2 5.93913 2.42143 4.92172 3.17157 4.17157C3.92172 3.42143 4.93913 3 6 3H17C18.0609 3 19.0783 3.42143 19.8284 4.17157C20.5786 4.92172 21 5.93913 21 7V10"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 2V4"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 2V4"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8H21"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 15.6426L17 17.1426"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 22C19.7614 22 22 19.7614 22 17C22 14.2386 19.7614 12 17 12C14.2386 12 12 14.2386 12 17C12 19.7614 14.2386 22 17 22Z"
        stroke="#93C198"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconClock = ({ disabled }) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.5 : 0.8}>
      <path
        d="M7.9572 7.60283V11.1528M6.6 1.65283L9.47143 1.65283M13.4644 6.83287L14.6516 5.64569M14.8214 11.0743C14.8214 14.8219 11.7834 17.86 8.03571 17.86C4.28807 17.86 1.25 14.8219 1.25 11.0743C1.25 7.32661 4.28807 4.28854 8.03571 4.28854C11.7834 4.28854 14.8214 7.32661 14.8214 11.0743Z"
        stroke="black"
        // strokeOpacity="0.48"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconNotSelect = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="19"
      height="19"
      rx="3.5"
      stroke="#3C3C43"
      strokeOpacity="0.3"
    />
  </svg>
);

const IconSelect = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#4C96FD" />
    <path
      d="M9.81806 14.5401L7.07564 11.7977L6.95442 11.6765L6.83321 11.7977L5.87866 12.7523L5.75744 12.8735L5.87866 12.9947L9.69684 16.8129L9.81806 16.9341L9.93928 16.8129L18.1211 8.63106L18.2423 8.50984L18.1211 8.38862L17.1666 7.43408L17.0453 7.31286L16.9241 7.43408L9.81806 14.5401Z"
      fill="white"
      stroke="white"
      strokeWidth="0.342857"
    />
  </svg>
);

const IconPlus = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.70016 1.16667C7.70016 0.780075 7.38675 0.466675 7.00016 0.466675C6.61356 0.466675 6.30016 0.780075 6.30016 1.16667V6.30005H1.16666C0.78006 6.30005 0.46666 6.61345 0.46666 7.00005C0.46666 7.38665 0.78006 7.70005 1.16666 7.70005H6.30016V12.8333C6.30016 13.2199 6.61356 13.5333 7.00016 13.5333C7.38675 13.5333 7.70016 13.2199 7.70016 12.8333V7.70005H12.8333C13.2199 7.70005 13.5333 7.38665 13.5333 7.00005C13.5333 6.61345 13.2199 6.30005 12.8333 6.30005H7.70016V1.16667Z"
      fill={color || '#3C3C43'}
      fillOpacity="0.6"
    />
  </svg>
);

const IconFilter = ({ color }) => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6667 1H1.33334L6.66668 7.30667V11.6667L9.33334 13V7.30667L14.6667 1Z"
      stroke={color || '#3C3C43'}
      strokeOpacity="0.6"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDeleteHeader = () => (
  <svg
    width="18"
    height="21"
    viewBox="0 0 18 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M1 5.04483H2.8H17.2"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.49999 5.04482V3.24482C5.49999 2.76743 5.68963 2.3096 6.0272 1.97203C6.36476 1.63447 6.8226 1.44482 7.29999 1.44482H10.9C11.3774 1.44482 11.8352 1.63447 12.1728 1.97203C12.5103 2.3096 12.7 2.76743 12.7 3.24482V5.04482M15.4 5.04482V17.6448C15.4 18.1222 15.2103 18.5801 14.8728 18.9176C14.5352 19.2552 14.0774 19.4448 13.6 19.4448H4.59999C4.1226 19.4448 3.66476 19.2552 3.3272 18.9176C2.98963 18.5801 2.79999 18.1222 2.79999 17.6448V5.04482H15.4Z"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.29999 9.54483V14.9448"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9 9.54483V14.9448"
        stroke="#3C3C43"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconSearch = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.502 6.84461C1.502 3.8941 3.89387 1.50224 6.84438 1.50224C9.79489 1.50224 12.1867 3.8941 12.1867 6.84461C12.1867 9.79512 9.79489 12.187 6.84438 12.187C3.89387 12.187 1.502 9.79512 1.502 6.84461ZM6.84438 0.20224C3.17589 0.20224 0.202003 3.17613 0.202003 6.84461C0.202003 10.5131 3.17589 13.487 6.84438 13.487C8.36535 13.487 9.76692 12.9758 10.8867 12.1158L12.9025 14.1264C13.1567 14.3799 13.5682 14.3794 13.8217 14.1252C14.0752 13.871 14.0747 13.4595 13.8205 13.206L11.8362 11.2268C12.8637 10.0573 13.4867 8.52372 13.4867 6.84461C13.4867 3.17613 10.5129 0.20224 6.84438 0.20224Z"
      fill="#3C3C43"
      fillOpacity="0.6"
    />
  </svg>
);

const IconLayout = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z"
      stroke="#93C198"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 7H19"
      stroke="#93C198"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 19V7"
      stroke="#93C198"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCamera = () => (
  <svg
    width="18"
    height="15"
    viewBox="0 0 18 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.45355 0.308528C6.52266 0.204852 6.63902 0.142578 6.76363 0.142578H11.2357C11.3603 0.142578 11.4766 0.204852 11.5458 0.308528L12.9258 2.3786H15.7077C16.2019 2.3786 16.6759 2.57492 17.0253 2.92437C17.3748 3.27381 17.5711 3.74776 17.5711 4.24196V12.4407C17.5711 12.9349 17.3748 13.4089 17.0253 13.7583C16.6759 14.1077 16.2019 14.3041 15.7077 14.3041H2.29158C1.79738 14.3041 1.32343 14.1077 0.973986 13.7583C0.62454 13.4089 0.428223 12.9349 0.428223 12.4407V4.24196C0.428223 3.74776 0.62454 3.27381 0.973986 2.92437C1.32343 2.57492 1.79738 2.3786 2.29158 2.3786H5.0735L6.45355 0.308528ZM15.7072 5.36041C15.7072 5.97787 15.2067 6.47842 14.5892 6.47842C13.9717 6.47842 13.4712 5.97787 13.4712 5.36041C13.4712 4.74295 13.9717 4.2424 14.5892 4.2424C15.2067 4.2424 15.7072 4.74295 15.7072 5.36041ZM8.99943 10.9506C10.646 10.9506 11.9808 9.61579 11.9808 7.96923C11.9808 6.32266 10.646 4.98786 8.99943 4.98786C7.35287 4.98786 6.01807 6.32266 6.01807 7.96923C6.01807 9.61579 7.35287 10.9506 8.99943 10.9506Z"
      fill="white"
    />
  </svg>
);

const IconCut = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.968 7.44614C14.5635 7.79805 15.2582 8 16 8C18.2091 8 20 6.20914 20 4C20 1.79086 18.2091 0 16 0C13.7909 0 12 1.79086 12 4C12 4.65247 12.1562 5.26845 12.4333 5.81258L9.15913 7.74492L8.70711 7.29289C8.63111 7.21689 8.54335 7.15363 8.44721 7.10556L1.44721 3.60556C0.981945 3.37293 0.416031 3.53585 0.145672 3.98025C-0.124687 4.42465 -0.00919151 5.00211 0.411299 5.30834L12.4803 14.0978C12.174 14.6636 12 15.3115 12 16C12 18.2091 13.7909 20 16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C15.2582 12 14.5635 12.2019 13.968 12.5539L11.4141 9.99996L13.968 7.44614ZM18 4C18 2.89543 17.1046 2 16 2C14.8954 2 14 2.89543 14 4C14 4.53419 14.2094 5.01947 14.5507 5.3782C14.5751 5.40029 14.5985 5.42373 14.6209 5.44852C14.9798 5.79023 15.4654 6 16 6C17.1046 6 18 5.10457 18 4ZM18 16C18 14.8954 17.1046 14 16 14C15.4652 14 14.9795 14.2099 14.6207 14.5518C14.5984 14.5764 14.5751 14.5996 14.551 14.6215C14.2096 14.9803 14 15.4657 14 16C14 17.1046 14.8954 18 16 18C17.1046 18 18 17.1046 18 16Z"
      fill="white"
    />
    <path
      d="M6.5547 11.1679C6.14155 10.8925 5.58888 10.962 5.25671 11.331L0.756706 16.331C0.419493 16.7057 0.413872 17.2728 0.743591 17.6541C1.07331 18.0354 1.63528 18.1117 2.0547 17.8321L8.0547 13.8321C8.3329 13.6466 8.5 13.3344 8.5 13C8.5 12.6656 8.3329 12.3534 8.0547 12.1679L6.5547 11.1679Z"
      fill="white"
    />
  </svg>
);

const IconPre = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0007 -2.86102e-06L3.50073 6L12.0007 12L12.0007 -2.86102e-06ZM2.00073 12L2.00073 -3.73525e-06L0.00073061 -3.9101e-06L0.000729561 12L2.00073 12Z"
      fill="white"
    />
  </svg>
);

const IconNext = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-0.000732422 12L8.49927 6L-0.000732422 0V12ZM9.99927 0V12H11.9993V0H9.99927Z"
      fill="white"
    />
  </svg>
);

const IconPause = () => (
  <svg
    width="10"
    height="14"
    viewBox="0 0 10 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 14V0H2V14H0ZM8 14V0H10V14H8Z"
      fill="white"
    />
  </svg>
);

const IconOpenPopup = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5652 1H15"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 3.43478V1"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12.5645V14.9992"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5652 14.999H15"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.43478 15H1"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 12.5654V15.0002"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 3.43478V1"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.43478 1H1"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 14.9998L10.8 10.7998"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.2 5.2L1 1"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.2 10.7998L1 14.9998"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 1L10.8 5.2"
      stroke="white"
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconList = () => (
  <svg
    width="24"
    height="20"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33333 2.66667C2.06971 2.66667 2.66667 2.06971 2.66667 1.33333C2.66667 0.596954 2.06971 0 1.33333 0C0.596954 0 0 0.596954 0 1.33333C0 2.06971 0.596954 2.66667 1.33333 2.66667Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
    <path
      d="M1.33333 9.33342C2.06971 9.33342 2.66667 8.73646 2.66667 8.00008C2.66667 7.2637 2.06971 6.66675 1.33333 6.66675C0.596954 6.66675 0 7.2637 0 8.00008C0 8.73646 0.596954 9.33342 1.33333 9.33342Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
    <path
      d="M1.33333 15.9999C2.06971 15.9999 2.66667 15.403 2.66667 14.6666C2.66667 13.9302 2.06971 13.3333 1.33333 13.3333C0.596954 13.3333 0 13.9302 0 14.6666C0 15.403 0.596954 15.9999 1.33333 15.9999Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
    <path
      d="M22.7467 6.66675H6.58668C5.89448 6.66675 5.33334 7.22788 5.33334 7.92008V8.08008C5.33334 8.77228 5.89448 9.33342 6.58668 9.33342H22.7467C23.4389 9.33342 24 8.77228 24 8.08008V7.92008C24 7.22788 23.4389 6.66675 22.7467 6.66675Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
    <path
      d="M22.7467 13.3333H6.58668C5.89448 13.3333 5.33334 13.8944 5.33334 14.5866V14.7466C5.33334 15.4388 5.89448 15.9999 6.58668 15.9999H22.7467C23.4389 15.9999 24 15.4388 24 14.7466V14.5866C24 13.8944 23.4389 13.3333 22.7467 13.3333Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
    <path
      d="M22.7467 0H6.58668C5.89448 0 5.33334 0.561137 5.33334 1.25333V1.41333C5.33334 2.10553 5.89448 2.66667 6.58668 2.66667H22.7467C23.4389 2.66667 24 2.10553 24 1.41333V1.25333C24 0.561137 23.4389 0 22.7467 0Z"
      stroke="#3C3C43"
      fillOpacity="0.6"
    />
  </svg>
);

const IconLock = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="15"
        x2="12"
        y2="18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconUnLock = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11.0002V7.00015C6.99876 5.7602 7.45828 4.56402 8.28938 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="15"
        x2="12"
        y2="18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconStop = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="13" height="13" rx="3" fill="white" />
  </svg>
);

const IconRecord = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003ZM13.0306 10.0003C13.0306 11.6739 11.6739 13.0306 10.0003 13.0306C8.32674 13.0306 6.97002 11.6739 6.97002 10.0003C6.97002 8.32674 8.32674 6.97002 10.0003 6.97002C11.6739 6.97002 13.0306 8.32674 13.0306 10.0003Z"
      fill="white"
    />
  </svg>
);

const IconCopy = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 8H10C8.89543 8 8 8.89543 8 10V19C8 20.1046 8.89543 21 10 21H19C20.1046 21 21 20.1046 21 19V10C21 8.89543 20.1046 8 19 8Z"
      stroke="black"
      strokeOpacity="0.36"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V4"
      stroke="black"
      strokeOpacity="0.36"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconEraser = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1256 3.10071C15.3461 2.93453 15.6596 2.97858 15.8258 3.19911L22.2578 11.7341C22.3376 11.84 22.3721 11.9733 22.3536 12.1046C22.3352 12.2359 22.2653 12.3545 22.1594 12.4343L15.1964 17.6813C15.1914 17.6851 15.1863 17.6888 15.1811 17.6924L13.5169 18.8508L12.7239 19.486H21.7505C22.0266 19.486 22.2505 19.7099 22.2505 19.986C22.2505 20.2622 22.0266 20.486 21.7505 20.486H11.3367C11.3239 20.487 11.3109 20.4875 11.298 20.4875L6.01645 20.487C5.8595 20.487 5.71166 20.4133 5.6172 20.288L4.3172 18.563L1.1007 14.295C1.02088 14.189 0.986413 14.0558 1.00487 13.9244C1.02332 13.7931 1.09319 13.6745 1.1991 13.5947L6.23113 9.80296L6.2341 9.80071L15.1256 3.10071ZM11.1243 19.486H6.26502L5.11581 17.9611L4.7165 18.262L5.11581 17.9611L2.20025 14.0924L6.45035 10.8899L12.5125 18.3741L11.1243 19.486ZM7.24947 10.2877L13.3134 17.7741L14.6021 16.8771L21.1583 11.9366L15.3281 4.20024L7.24947 10.2877Z"
      fill="black"
      fillOpacity="0.48"
    />
  </svg>
);

const IconEditSchedule = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 18H19"
      stroke="black"
      strokeOpacity="0.48"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 1.50023C14.8978 1.1024 15.4374 0.878906 16 0.878906C16.2786 0.878906 16.5544 0.933776 16.8118 1.04038C17.0692 1.14699 17.303 1.30324 17.5 1.50023C17.697 1.69721 17.8532 1.93106 17.9598 2.18843C18.0665 2.4458 18.1213 2.72165 18.1213 3.00023C18.1213 3.2788 18.0665 3.55465 17.9598 3.81202C17.8532 4.06939 17.697 4.30324 17.5 4.50023L5 17.0002L1 18.0002L2 14.0002L14.5 1.50023Z"
      stroke="black"
      strokeOpacity="0.48"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconUpdrageLicense = () => (
  <svg
    width="16"
    height="20"
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 12V6L10 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V14H9V17L4 13L9 9V12H16ZM9 2L14 7H9V2Z"
      fill="#4C96FD"
    />
  </svg>
);

const IconCopyLicence = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M8.61203 16.7513C6.65952 16.7513 5.07031 15.162 5.07031 13.2095V4.66797H3.61203C2.34784 4.66797 1.32031 5.69534 1.32031 6.95953V18.2095C1.32031 19.4737 2.34784 20.5013 3.61203 20.5013H14.0286C15.2928 20.5013 16.3203 19.4737 16.3203 18.2095V16.7513H8.61203Z"
        fill="#1976D2"
      />
      <path
        d="M19.6536 2.79172C19.6536 1.52585 18.6277 0.5 17.362 0.5H8.61203C7.34616 0.5 6.32031 1.52585 6.32031 2.79172V13.2083C6.32031 14.4742 7.34616 15.5 8.61203 15.5H17.362C18.6277 15.5 19.6536 14.4742 19.6536 13.2083V2.79172Z"
        fill="#2196F3"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0.5 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

const IconUl = ({ disabled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.2 : 0.48}>
      <path
        d="M19 12.824V16.824C19 17.3544 18.7893 17.8631 18.4142 18.2382C18.0391 18.6133 17.5304 18.824 17 18.824H3C2.46957 18.824 1.96086 18.6133 1.58579 18.2382C1.21071 17.8631 1 17.3544 1 16.824V12.824"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 6.1626L10 1.044L15 6.1626"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.04398V13.3286"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const IconViewDetail = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.0013 1.29102C13.2588 1.29102 16.7096 4.74268 16.7096 8.99935C16.7096 13.256 13.2588 16.7077 9.0013 16.7077C4.74464 16.7077 1.29297 13.256 1.29297 8.99935C1.29297 4.74268 4.74464 1.29102 9.0013 1.29102Z"
      stroke="#424242"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.9987 5.83594V9.51844"
      stroke="#424242"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.99844 12.1628H9.00677"
      stroke="#424242"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFile = () => (
  <svg
    width="15"
    height="20"
    viewBox="0 0 15 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M8.125 0H1.25C0.898438 0 0.602214 0.120443 0.361328 0.361328C0.120443 0.602214 0 0.898438 0 1.25V18.75C0 19.1016 0.120443 19.3978 0.361328 19.6387C0.602214 19.8796 0.898438 20 1.25 20H13.125C13.4766 20 13.7728 19.8796 14.0137 19.6387C14.2546 19.3978 14.375 19.1016 14.375 18.75V6.25L8.125 0ZM13.125 6.77734V6.875H7.5V1.25H7.61719L13.125 6.77734ZM1.25 18.75V1.25H6.25V8.125H13.125V18.75H1.25Z"
        fill="#5C5C5C"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="14.375" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconArrowDown = () => (
  <svg
    width="12"
    height="7"
    viewBox="0 0 12 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8537 0.645818C12.0493 0.840732 12.0499 1.15731 11.855 1.35292L6.39 6.83741C6.17505 7.05312 5.82574 7.05312 5.6108 6.83741L0.145817 1.35292C-0.0490969 1.15731 -0.0485323 0.840731 0.147077 0.645817C0.342687 0.450903 0.659269 0.451467 0.854182 0.647077L6.0004 5.81166L11.1466 0.647077C11.3415 0.451468 11.6581 0.450904 11.8537 0.645818Z"
      fill="#424242"
    />
  </svg>
);

const IconShowPass = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 6.09091C1 6.09091 3.54545 1 8 1C12.4545 1 15 6.09091 15 6.09091C15 6.09091 12.4545 11.1818 8 11.1818C3.54545 11.1818 1 6.09091 1 6.09091Z"
      stroke="#484644"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99893 7.99885C9.0533 7.99885 9.90802 7.14412 9.90802 6.08975C9.90802 5.03539 9.0533 4.18066 7.99893 4.18066C6.94457 4.18066 6.08984 5.03539 6.08984 6.08975C6.08984 7.14412 6.94457 7.99885 7.99893 7.99885Z"
      stroke="#484644"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHiddenPass = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.66364 3.15274C7.10167 3.05021 7.55013 2.99896 8 3.00002C12.4545 3.00002 15 8.09092 15 8.09092C14.6137 8.81358 14.153 9.49394 13.6255 10.1209M9.34909 9.44002C9.17431 9.62758 8.96355 9.77802 8.72937 9.88237C8.49519 9.98671 8.24239 10.0428 7.98606 10.0473C7.72972 10.0519 7.4751 10.0047 7.23739 9.90869C6.99967 9.81267 6.78373 9.66976 6.60245 9.48848C6.42116 9.30719 6.27825 9.09125 6.18223 8.85354C6.08622 8.61582 6.03906 8.3612 6.04358 8.10487C6.04811 7.84853 6.10421 7.59574 6.20856 7.36156C6.3129 7.12738 6.46334 6.91661 6.65091 6.74183M11.78 11.8709C10.6922 12.7001 9.36761 13.1595 8 13.1818C3.54545 13.1818 1 8.09092 1 8.09092C1.79157 6.61577 2.88945 5.32695 4.22 4.31093L11.78 11.8709Z"
      stroke="#484644"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 1L15 15"
      stroke="#484644"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconOption = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 14L16 14"
      stroke="#616161"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10L16 10"
      stroke="#616161"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 6L16 6"
      stroke="#616161"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFace = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.333 13.4043C13.5719 13.9694 12.499 14.6543 10.9998 14.6543C9.50052 14.6543 8.42768 13.9694 7.66652 13.4043"
      stroke="#1C1D21"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.73669 8.36334C1.31104 8.36334 0.969368 8.00679 0.996208 7.58199C1.33902 2.15621 3.08457 0.410691 8.51037 0.0678864C8.93517 0.0410471 9.29172 0.382715 9.29172 0.808366C9.29172 1.21147 8.97308 1.54118 8.57081 1.56711C7.66113 1.62574 6.89068 1.72457 6.23498 1.87029C5.08507 2.12585 4.38206 2.50525 3.90781 2.9795C3.43357 3.45375 3.05417 4.15675 2.79861 5.30667C2.65289 5.96235 2.55406 6.73278 2.49543 7.64243C2.4695 8.0447 2.13979 8.36334 1.73669 8.36334ZM0.928503 9.94846C0.928458 9.97753 0.928436 10.0067 0.928436 10.0359C0.928436 10.0651 0.928458 10.0943 0.928503 10.1234L0.928503 9.94846ZM1.73669 11.7086C1.31104 11.7086 0.969374 12.0652 0.996216 12.49C1.33905 17.9156 3.08461 19.6611 8.51037 20.0039C8.93517 20.0308 9.29172 19.6891 9.29172 19.2635C9.29172 18.8604 8.97308 18.5306 8.57081 18.5047C7.66113 18.4461 6.89068 18.3473 6.23498 18.2015C5.08507 17.946 4.38206 17.5666 3.90781 17.0923C3.43357 16.6181 3.05417 15.9151 2.79861 14.7652C2.6529 14.1095 2.55407 13.3391 2.49544 12.4295C2.46951 12.0272 2.1398 11.7086 1.73669 11.7086ZM20.1918 11.7086C19.7887 11.7086 19.4589 12.0272 19.433 12.4295C19.3744 13.3391 19.2756 14.1095 19.1298 14.7652C18.8743 15.9151 18.4949 16.6181 18.0206 17.0923C17.5464 17.5666 16.8434 17.946 15.6935 18.2015C15.0378 18.3472 14.2675 18.4461 13.3579 18.5047C12.9556 18.5306 12.637 18.8603 12.637 19.2634C12.637 19.6891 12.9935 20.0308 13.4183 20.0039C18.8439 19.6611 20.5894 17.9156 20.9322 12.49C20.9591 12.0652 20.6174 11.7086 20.1918 11.7086ZM20.1918 8.36334C20.6174 8.36334 20.9591 8.00679 20.9322 7.58199C20.5894 2.1563 18.8439 0.410747 13.4183 0.0679029C12.9935 0.0410594 12.637 0.382729 12.637 0.808382C12.637 1.21148 12.9556 1.54119 13.3579 1.56712C14.2675 1.62575 15.0378 1.72458 15.6935 1.87029C16.8434 2.12585 17.5464 2.50525 18.0206 2.9795C18.4949 3.45375 18.8743 4.15675 19.1298 5.30667C19.2756 5.96235 19.3744 6.73278 19.433 7.64243C19.459 8.0447 19.7887 8.36334 20.1918 8.36334ZM10.9642 20.0717L10.8684 20.0716H11.06L10.9642 20.0717Z"
      fill="#1C1D21"
    />
    <path
      d="M10.9998 9.09473V11.5947"
      stroke="#1C1D21"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4997 6.59473V7.42804"
      stroke="#1C1D21"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.49985 6.59473V7.42804"
      stroke="#1C1D21"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFinger = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.00092 11.137C6.70292 8.30561 9.31312 6.41688 12.1795 7.18491C15.0458 7.95295 16.362 10.8937 15.5542 13.6968"
      stroke="#1C1D21"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.50033 12.0001C8.87418 10.506 10.1336 9.477 11.4736 9.83606C12.8137 10.1951 13.3898 11.716 12.9665 13.1968"
      stroke="#1C1D21"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.73669 8.36334C1.31104 8.36334 0.969368 8.00679 0.996208 7.58199C1.33902 2.15621 3.08457 0.410691 8.51037 0.0678864C8.93517 0.0410471 9.29172 0.382715 9.29172 0.808366C9.29172 1.21147 8.97308 1.54118 8.57081 1.56711C7.66113 1.62574 6.89068 1.72457 6.23498 1.87029C5.08507 2.12585 4.38206 2.50525 3.90781 2.9795C3.43357 3.45375 3.05417 4.15675 2.79861 5.30667C2.65289 5.96235 2.55406 6.73278 2.49543 7.64243C2.4695 8.0447 2.13979 8.36334 1.73669 8.36334ZM0.928503 9.94846C0.928458 9.97753 0.928436 10.0067 0.928436 10.0359C0.928436 10.0651 0.928458 10.0943 0.928503 10.1234L0.928503 9.94846ZM1.73669 11.7086C1.31104 11.7086 0.969374 12.0652 0.996216 12.49C1.33905 17.9156 3.08461 19.6611 8.51037 20.0039C8.93517 20.0308 9.29172 19.6891 9.29172 19.2635C9.29172 18.8604 8.97308 18.5306 8.57081 18.5047C7.66113 18.4461 6.89068 18.3473 6.23498 18.2015C5.08507 17.946 4.38206 17.5666 3.90781 17.0923C3.43357 16.6181 3.05417 15.9151 2.79861 14.7652C2.6529 14.1095 2.55407 13.3391 2.49544 12.4295C2.46951 12.0272 2.1398 11.7086 1.73669 11.7086ZM20.1918 11.7086C19.7887 11.7086 19.4589 12.0272 19.433 12.4295C19.3744 13.3391 19.2756 14.1095 19.1298 14.7652C18.8743 15.9151 18.4949 16.6181 18.0206 17.0923C17.5464 17.5666 16.8434 17.946 15.6935 18.2015C15.0378 18.3472 14.2675 18.4461 13.3579 18.5047C12.9556 18.5306 12.637 18.8603 12.637 19.2634C12.637 19.6891 12.9935 20.0308 13.4183 20.0039C18.8439 19.6611 20.5894 17.9156 20.9322 12.49C20.9591 12.0652 20.6174 11.7086 20.1918 11.7086ZM20.1918 8.36334C20.6174 8.36334 20.9591 8.00679 20.9322 7.58199C20.5894 2.1563 18.8439 0.410747 13.4183 0.0679029C12.9935 0.0410594 12.637 0.382729 12.637 0.808382C12.637 1.21148 12.9556 1.54119 13.3579 1.56712C14.2675 1.62575 15.0378 1.72458 15.6935 1.87029C16.8434 2.12585 17.5464 2.50525 18.0206 2.9795C18.4949 3.45375 18.8743 4.15675 19.1298 5.30667C19.2756 5.96235 19.3744 6.73278 19.433 7.64243C19.459 8.0447 19.7887 8.36334 20.1918 8.36334ZM10.9642 20.0717L10.8684 20.0716H11.06L10.9642 20.0717Z"
      fill="#1C1D21"
    />
  </svg>
);

const IconCard = () => (
  <svg
    width="22"
    height="20"
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.31279 0.708985H6.28274H6.28273C5.52122 0.708978 4.90698 0.708973 4.40858 0.747178C3.89569 0.786494 3.44398 0.869489 3.02217 1.06898C2.2378 1.43993 1.60634 2.07139 1.23539 2.85575C1.0359 3.27757 0.952907 3.72928 0.91359 4.24217C0.875385 4.74056 0.875391 5.35481 0.875397 6.11632V6.11633V6.14637C0.875397 6.56059 1.21118 6.89637 1.6254 6.89637C2.03961 6.89637 2.3754 6.56059 2.3754 6.14637C2.3754 5.34779 2.37591 4.79112 2.4092 4.35682C2.44188 3.93046 2.50289 3.68419 2.59139 3.49705C2.81396 3.02643 3.19284 2.64755 3.66346 2.42498C3.8506 2.33648 4.09688 2.27547 4.52323 2.24279C4.95754 2.2095 5.5142 2.20898 6.31279 2.20898C6.727 2.20898 7.06279 1.8732 7.06279 1.45898C7.06279 1.04477 6.727 0.708985 6.31279 0.708985ZM15.6876 2.20898C16.4861 2.20898 17.0428 2.2095 17.4771 2.24279C17.9035 2.27547 18.1497 2.33648 18.3369 2.42498C18.8075 2.64755 19.1864 3.02643 19.409 3.49705C19.4975 3.68419 19.5585 3.93046 19.5911 4.35682C19.6244 4.79112 19.625 5.34779 19.625 6.14637C19.625 6.56059 19.9607 6.89637 20.375 6.89637C20.7892 6.89637 21.125 6.56059 21.125 6.14637V6.11633V6.11627C21.125 5.35478 21.125 4.74055 21.0868 4.24217C21.0474 3.72928 20.9644 3.27757 20.765 2.85575C20.394 2.07139 19.7625 1.43993 18.9782 1.06898C18.5564 0.869489 18.1047 0.786494 17.5918 0.747178C17.0934 0.708973 16.4791 0.708978 15.7176 0.708985H15.7176H15.6876C15.2733 0.708985 14.9376 1.04477 14.9376 1.45898C14.9376 1.8732 15.2733 2.20898 15.6876 2.20898ZM2.3754 13.6462C2.3754 13.232 2.03961 12.8962 1.6254 12.8962C1.21118 12.8962 0.875397 13.232 0.875397 13.6462V13.6762V13.6762C0.875391 14.4378 0.875385 15.052 0.91359 15.5504C0.952907 16.0633 1.0359 16.515 1.23539 16.9368C1.60634 17.7212 2.2378 18.3526 3.02217 18.7236C3.44398 18.9231 3.89569 19.0061 4.40858 19.0454C4.90697 19.0836 5.52119 19.0836 6.28268 19.0836H6.28275H6.31279C6.727 19.0836 7.06279 18.7478 7.06279 18.3336C7.06279 17.9194 6.727 17.5836 6.31279 17.5836C5.5142 17.5836 4.95754 17.5831 4.52323 17.5498C4.09688 17.5171 3.8506 17.4561 3.66346 17.3676C3.19284 17.145 2.81396 16.7661 2.59139 16.2955C2.50289 16.1084 2.44188 15.8621 2.4092 15.4357C2.37591 15.0014 2.3754 14.4448 2.3754 13.6462ZM21.125 13.6462C21.125 13.232 20.7892 12.8962 20.375 12.8962C19.9607 12.8962 19.625 13.232 19.625 13.6462C19.625 14.4448 19.6244 15.0014 19.5911 15.4357C19.5585 15.8621 19.4975 16.1084 19.409 16.2955C19.1864 16.7661 18.8075 17.145 18.3369 17.3676C18.1497 17.4561 17.9035 17.5171 17.4771 17.5498C17.0428 17.5831 16.4861 17.5836 15.6876 17.5836C15.2733 17.5836 14.9376 17.9194 14.9376 18.3336C14.9376 18.7478 15.2733 19.0836 15.6876 19.0836H15.7176H15.7177C16.4792 19.0836 17.0934 19.0836 17.5918 19.0454C18.1047 19.0061 18.5564 18.9231 18.9782 18.7236C19.7625 18.3526 20.394 17.7212 20.765 16.9368C20.9644 16.515 21.0474 16.0633 21.0868 15.5504C21.125 15.052 21.125 14.4378 21.125 13.6763V13.6762V13.6462ZM8.5501 4.46412L8.58053 4.46412L13.4303 4.46412L13.4607 4.46412C13.9949 4.46411 14.4407 4.4641 14.8049 4.49386C15.1848 4.5249 15.5415 4.59201 15.8787 4.76385C16.3962 5.0275 16.8169 5.4482 17.0805 5.96564C17.2524 6.30291 17.3195 6.65956 17.3505 7.03945C17.3803 7.40364 17.3803 7.84942 17.3803 8.38348V8.38367V8.41412V8.95856V11.3889V11.4193V11.4195C17.3803 11.9536 17.3803 12.3994 17.3505 12.7636C17.3195 13.1434 17.2524 13.5001 17.0805 13.8374C16.8169 14.3548 16.3962 14.7755 15.8787 15.0392C15.5415 15.211 15.1848 15.2781 14.8049 15.3092C14.4407 15.3389 13.9949 15.3389 13.4607 15.3389H13.4607H13.4303L8.58053 15.3389H8.55013H8.55008C8.01593 15.3389 7.57009 15.3389 7.20586 15.3092C6.82598 15.2781 6.46932 15.211 6.13206 15.0392C5.61461 14.7755 5.19392 14.3548 4.93026 13.8374C4.75842 13.5001 4.69131 13.1434 4.66027 12.7636C4.63051 12.3993 4.63052 11.9535 4.63053 11.4193L4.63053 11.3889L4.63053 8.95856V8.41412L4.63053 8.38368C4.63052 7.84953 4.63051 7.40368 4.66027 7.03945C4.69131 6.65956 4.75842 6.30291 4.93026 5.96564C5.19392 5.4482 5.61461 5.0275 6.13206 4.76385C6.46932 4.59201 6.82598 4.5249 7.20586 4.49386C7.57009 4.4641 8.01594 4.46411 8.5501 4.46412ZM15.8555 7.1616C15.8767 7.42058 15.8798 7.74724 15.8802 8.20856L6.1306 8.20856C6.13104 7.74724 6.13413 7.42058 6.15529 7.1616C6.17875 6.87447 6.22063 6.73719 6.26677 6.64663C6.38661 6.41143 6.57784 6.2202 6.81304 6.10036C6.9036 6.05422 7.04089 6.01234 7.32801 5.98888C7.62389 5.9647 8.0081 5.96412 8.58053 5.96412L13.4303 5.96412C14.0027 5.96412 14.3869 5.9647 14.6828 5.98888C14.9699 6.01234 15.1072 6.05422 15.1978 6.10036C15.433 6.2202 15.6242 6.41143 15.744 6.64663C15.7902 6.73719 15.832 6.87447 15.8555 7.1616ZM15.8803 9.70856L6.13053 9.70856V11.3889C6.13053 11.9613 6.13111 12.3455 6.15529 12.6414C6.17875 12.9285 6.22063 13.0658 6.26677 13.1564C6.38661 13.3916 6.57784 13.5828 6.81304 13.7027C6.9036 13.7488 7.04089 13.7907 7.32801 13.8141C7.62389 13.8383 8.0081 13.8389 8.58053 13.8389L13.4303 13.8389C14.0027 13.8389 14.3869 13.8383 14.6828 13.8141C14.9699 13.7907 15.1072 13.7488 15.1978 13.7027C15.433 13.5828 15.6242 13.3916 15.744 13.1564C15.7902 13.0658 15.832 12.9285 15.8555 12.6414C15.8797 12.3455 15.8803 11.9613 15.8803 11.3889V9.70856Z"
      fill="#1C1D21"
    />
  </svg>
);

const IconSetting = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_589:31952)">
      <path
        d="M0.987751 7.0455L2.39775 6.86625C2.514 6.5085 2.65725 6.1635 2.8245 5.83575L1.95375 4.7145C1.60125 4.26075 1.6425 3.62025 2.04525 3.23025L3.2265 2.049C3.62025 1.6425 4.26075 1.602 4.71525 1.95375L5.835 2.8245C6.16275 2.65725 6.50775 2.514 6.86625 2.39775L7.0455 0.99C7.113 0.42525 7.59225 0 8.16 0H9.84C10.4078 0 10.887 0.42525 10.9545 0.98775L11.1338 2.39775C11.4923 2.514 11.8373 2.6565 12.165 2.8245L13.2855 1.95375C13.7385 1.602 14.379 1.6425 14.7698 2.04525L15.951 3.22575C16.3575 3.62025 16.3988 4.26075 16.0463 4.71525L15.1755 5.83575C15.3435 6.1635 15.486 6.5085 15.6023 6.86625L17.01 7.0455C17.5748 7.113 18 7.59225 18 8.16V9.84C18 10.4078 17.5748 10.887 17.0123 10.9545L15.6023 11.1337C15.486 11.4915 15.3428 11.8365 15.1755 12.1642L16.0463 13.2855C16.3988 13.7393 16.3575 14.3798 15.9548 14.7698L14.7735 15.951C14.379 16.3568 13.7393 16.3972 13.2848 16.0455L12.1643 15.1747C11.8365 15.3427 11.4915 15.486 11.1338 15.6015L10.9545 17.0085C10.887 17.5747 10.4078 18 9.84 18H8.16C7.59225 18 7.113 17.5748 7.0455 17.0123L6.86625 15.6022C6.5085 15.486 6.1635 15.3427 5.83575 15.1755L4.7145 16.0462C4.26075 16.3988 3.62025 16.3575 3.23025 15.9548L2.049 14.7735C1.6425 14.379 1.60125 13.7392 1.95375 13.2847L2.8245 12.1642C2.6565 11.8365 2.51325 11.4915 2.39775 11.1337L0.990751 10.9545C0.426001 10.887 0.000751495 10.4078 0.000751495 9.84V8.16C1.90735e-06 7.59225 0.425251 7.113 0.987751 7.0455ZM9 12.75C11.0678 12.75 12.75 11.0677 12.75 9C12.75 6.93225 11.0678 5.25 9 5.25C6.93225 5.25 5.25 6.93225 5.25 9C5.25 11.0677 6.93225 12.75 9 12.75Z"
        fill="#7F7F7F"
      />
    </g>
    <defs>
      <clipPath id="clip0_589:31952">
        <rect
          width="18"
          height="18"
          fill="white"
          transform="matrix(-1 0 0 1 18 0)"
        />
      </clipPath>
    </defs>
  </svg>
);

const IconSync = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.4">
      <path
        d="M18.0501 8.6415C18.0781 8.59228 18.0978 8.53879 18.1084 8.48317L18.7334 5.14984C18.7732 4.92882 18.7235 4.70106 18.5954 4.51665C18.4672 4.33224 18.2711 4.20629 18.0501 4.1665C17.829 4.12672 17.6013 4.17636 17.4169 4.30451C17.2325 4.43266 17.1065 4.62882 17.0667 4.84984L16.7584 6.5165C16.0647 5.24977 15.0281 4.20418 13.7674 3.49966C12.5067 2.79514 11.0729 2.46021 9.63052 2.53328C8.18815 2.60636 6.79558 3.08448 5.61252 3.91281C4.42945 4.74114 3.5038 5.88615 2.94173 7.2165C2.85928 7.42098 2.86122 7.64979 2.94712 7.85284C3.03303 8.05589 3.1959 8.21662 3.40006 8.29984C3.50177 8.34195 3.61082 8.36349 3.72091 8.36322C3.831 8.36295 3.93994 8.34087 4.04144 8.29825C4.14295 8.25563 4.235 8.19333 4.31229 8.11493C4.38957 8.03654 4.45056 7.9436 4.49173 7.8415C4.94051 6.73884 5.71236 5.79773 6.70587 5.14183C7.69939 4.48594 8.86808 4.14593 10.0584 4.1665C11.1111 4.16159 12.1465 4.43492 13.0596 4.9588C13.9728 5.48269 14.7313 6.23854 15.2584 7.14984L13.8834 6.92484C13.774 6.90733 13.6621 6.91154 13.5543 6.93725C13.4465 6.96295 13.3448 7.00963 13.2551 7.07463C13.1653 7.13963 13.0892 7.22168 13.0312 7.31608C12.9731 7.41049 12.9342 7.5154 12.9167 7.62484C12.8992 7.73427 12.9034 7.84608 12.9291 7.95389C12.9548 8.06169 13.0015 8.16338 13.0665 8.25314C13.1315 8.34291 13.2136 8.41899 13.308 8.47704C13.4024 8.5351 13.5073 8.57399 13.6167 8.5915L17.1584 9.18317H17.2917C17.3885 9.18433 17.4846 9.16737 17.5751 9.13317C17.6056 9.12158 17.6338 9.10465 17.6584 9.08317C17.7181 9.06095 17.7743 9.03007 17.8251 8.9915L17.8917 8.90817C17.9349 8.86771 17.974 8.82304 18.0084 8.77484C18.0287 8.73264 18.0427 8.68773 18.0501 8.6415ZM16.5667 11.7248C16.4645 11.683 16.355 11.6618 16.2445 11.6626C16.134 11.6635 16.0248 11.6863 15.9232 11.7297C15.8216 11.7731 15.7297 11.8363 15.6528 11.9156C15.5758 11.9949 15.5154 12.0887 15.4751 12.1915C15.0231 13.2826 14.2542 14.2129 13.2677 14.8622C12.2812 15.5114 11.1226 15.8497 9.94173 15.8332C8.88899 15.8381 7.85363 15.5648 6.94049 15.0409C6.02734 14.517 5.26883 13.7611 4.74173 12.8498L6.11673 13.0748H6.25006C6.47107 13.0925 6.69006 13.0217 6.85884 12.8779C7.02762 12.7341 7.13238 12.5292 7.15006 12.3082C7.16774 12.0872 7.0969 11.8682 6.95312 11.6994C6.80935 11.5306 6.60441 11.4258 6.38339 11.4082L2.84173 10.8332C2.75083 10.8164 2.65763 10.8164 2.56673 10.8332H2.50006C2.40575 10.8583 2.31582 10.8976 2.23339 10.9498C2.17721 10.9932 2.1268 11.0436 2.08339 11.0998L2.00839 11.1832C1.98264 11.2334 1.96305 11.2866 1.95006 11.3415C1.92086 11.3841 1.90098 11.4324 1.89173 11.4832L1.26673 14.8165C1.23996 14.9273 1.23619 15.0423 1.25565 15.1546C1.27511 15.2669 1.31739 15.3739 1.37987 15.4692C1.44235 15.5645 1.52371 15.646 1.61891 15.7086C1.71412 15.7712 1.82115 15.8136 1.93339 15.8332H2.08339C2.28072 15.8364 2.47278 15.7695 2.62538 15.6443C2.77799 15.5192 2.88123 15.344 2.91673 15.1498L3.22506 13.4832C3.91799 14.7502 4.95398 15.7963 6.21423 16.5015C7.47448 17.2067 8.90797 17.5425 10.3503 17.4703C11.7926 17.3981 13.1854 16.9208 14.3689 16.0933C15.5525 15.2657 16.4788 14.1214 17.0417 12.7915C17.1181 12.5869 17.1111 12.3605 17.0223 12.1611C16.9334 11.9616 16.7699 11.8049 16.5667 11.7248Z"
        fill="black"
      />
    </g>
  </svg>
);

const IconCardFly = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3.5" y="8.5" width="13" height="9" rx="1.5" stroke="#424242" />
    <path d="M13.5 7V4H6.5M6.5 4L9.5 1M6.5 4L9.5 7" stroke="#424242" />
    <line x1="3" y1="11.5" x2="17" y2="11.5" stroke="#424242" />
    <rect x="5" y="14" width="3" height="2" fill="#424242" />
  </svg>
);

const IconCardDashboard = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 14H24"
      stroke="#11194C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 18H24"
      stroke="#11194C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5127 18C13.1695 18 14.5127 16.6569 14.5127 15C14.5127 13.3431 13.1695 12 11.5127 12C9.85584 12 8.5127 13.3431 8.5127 15C8.5127 16.6569 9.85584 18 11.5127 18Z"
      stroke="#11194C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.63867 20.9999C7.86062 20.1413 8.36153 19.3807 9.06272 18.8377C9.76391 18.2947 10.6256 18 11.5125 18C12.3994 18 13.2611 18.2946 13.9623 18.8375C14.6636 19.3805 15.1645 20.141 15.3865 20.9997"
      stroke="#11194C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 6H5C4.44772 6 4 6.44772 4 7V25C4 25.5523 4.44772 26 5 26H27C27.5523 26 28 25.5523 28 25V7C28 6.44772 27.5523 6 27 6Z"
      stroke="#11194C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFingerDashboardEvent = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.3258 4.09742C16.2525 4.09742 16.1791 4.07909 16.115 4.04242C14.355 3.13492 12.8333 2.74992 11.0091 2.74992C9.19413 2.74992 7.4708 3.18075 5.9033 4.04242C5.6833 4.16159 5.4083 4.07909 5.27997 3.85909C5.1608 3.63909 5.2433 3.35492 5.4633 3.23575C7.1683 2.30992 9.0383 1.83325 11.0091 1.83325C12.9616 1.83325 14.6666 2.26409 16.5366 3.22659C16.7658 3.34575 16.8483 3.62075 16.7291 3.84075C16.6466 4.00575 16.4908 4.09742 16.3258 4.09742ZM3.2083 8.90992C3.11663 8.90992 3.02497 8.88242 2.94247 8.82742C2.73163 8.68075 2.6858 8.39659 2.83247 8.18575C3.73997 6.90242 4.89497 5.89409 6.26997 5.18825C9.1483 3.70325 12.8333 3.69409 15.7208 5.17909C17.0958 5.88492 18.2508 6.88409 19.1583 8.15825C19.305 8.35992 19.2591 8.65325 19.0483 8.79992C18.8375 8.94659 18.5533 8.90075 18.4066 8.68992C17.5816 7.53492 16.5366 6.62742 15.2991 5.99492C12.6683 4.64742 9.30413 4.64742 6.68247 6.00409C5.4358 6.64575 4.3908 7.56242 3.5658 8.71742C3.49247 8.84575 3.35497 8.90992 3.2083 8.90992ZM8.93747 19.9741C8.8183 19.9741 8.69913 19.9283 8.61663 19.8366C7.81913 19.0391 7.3883 18.5258 6.77413 17.4166C6.14163 16.2891 5.81163 14.9141 5.81163 13.4383C5.81163 10.7158 8.13997 8.49742 11 8.49742C13.86 8.49742 16.1883 10.7158 16.1883 13.4383C16.1883 13.6949 15.9866 13.8966 15.73 13.8966C15.4733 13.8966 15.2716 13.6949 15.2716 13.4383C15.2716 11.2199 13.3558 9.41409 11 9.41409C8.64413 9.41409 6.7283 11.2199 6.7283 13.4383C6.7283 14.7583 7.02163 15.9774 7.5808 16.9674C8.16747 18.0216 8.5708 18.4708 9.27663 19.1858C9.4508 19.3691 9.4508 19.6533 9.27663 19.8366C9.1758 19.9283 9.05663 19.9741 8.93747 19.9741ZM15.51 18.2783C14.4191 18.2783 13.4566 18.0033 12.6683 17.4624C11.3025 16.5366 10.4866 15.0333 10.4866 13.4383C10.4866 13.1816 10.6883 12.9799 10.945 12.9799C11.2016 12.9799 11.4033 13.1816 11.4033 13.4383C11.4033 14.7308 12.0633 15.9499 13.1816 16.7016C13.8325 17.1416 14.5933 17.3524 15.51 17.3524C15.73 17.3524 16.0966 17.3249 16.4633 17.2608C16.7108 17.2149 16.9491 17.3799 16.995 17.6366C17.0408 17.8841 16.8758 18.1224 16.6191 18.1683C16.0966 18.2691 15.6383 18.2783 15.51 18.2783ZM13.6675 20.1666C13.6308 20.1666 13.585 20.1574 13.5483 20.1483C12.0908 19.7449 11.1375 19.2041 10.1383 18.2233C8.85497 16.9491 8.14913 15.2533 8.14913 13.4383C8.14913 11.9533 9.41413 10.7433 10.9725 10.7433C12.5308 10.7433 13.7958 11.9533 13.7958 13.4383C13.7958 14.4191 14.6483 15.2166 15.7025 15.2166C16.7566 15.2166 17.6091 14.4191 17.6091 13.4383C17.6091 9.98242 14.63 7.17742 10.9633 7.17742C8.35997 7.17742 5.97663 8.62575 4.90413 10.8716C4.54663 11.6141 4.3633 12.4849 4.3633 13.4383C4.3633 14.1533 4.42747 15.2808 4.97747 16.7474C5.06913 16.9858 4.94997 17.2516 4.71163 17.3341C4.4733 17.4258 4.20747 17.2974 4.12497 17.0683C3.6758 15.8674 3.4558 14.6758 3.4558 13.4383C3.4558 12.3383 3.66663 11.3391 4.07913 10.4683C5.2983 7.91075 8.00247 6.25159 10.9633 6.25159C15.1341 6.25159 18.5258 9.46908 18.5258 13.4291C18.5258 14.9141 17.2608 16.1241 15.7025 16.1241C14.1441 16.1241 12.8791 14.9141 12.8791 13.4291C12.8791 12.4483 12.0266 11.6508 10.9725 11.6508C9.9183 11.6508 9.0658 12.4483 9.0658 13.4291C9.0658 14.9966 9.6708 16.4633 10.78 17.5633C11.6508 18.4249 12.485 18.9016 13.7775 19.2591C14.025 19.3233 14.1625 19.5799 14.0983 19.8183C14.0525 20.0291 13.86 20.1666 13.6675 20.1666Z"
      fill="#4B67E2"
    />
  </svg>
);

const IconFaceDashboardEvent = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 12.7341C12.315 13.2427 11.3494 13.8591 10.0001 13.8591C8.65074 13.8591 7.68518 13.2427 7.00013 12.7341"
      stroke="#4B67E2"
      strokeWidth="0.819005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.38593 8.19682C1.1536 8.19682 0.967467 8.00209 0.979615 7.77008C1.25157 2.57603 2.84076 0.986865 8.03484 0.714917C8.26684 0.70277 8.46157 0.888902 8.46157 1.12123V1.12123C8.46157 1.34136 8.28751 1.52176 8.06769 1.53335C7.10349 1.58418 6.28761 1.68082 5.59526 1.83469C4.49721 2.07872 3.76071 2.45568 3.24054 2.97585C2.72037 3.49602 2.34341 4.23252 2.09938 5.33057C1.94551 6.0229 1.84887 6.83876 1.79805 7.80293C1.78646 8.02275 1.60606 8.19682 1.38593 8.19682V8.19682ZM0.934633 9.62154C0.934591 9.64831 0.93457 9.67516 0.93457 9.70209C0.93457 9.72901 0.934591 9.75586 0.934633 9.78264L0.934633 9.62154ZM1.38594 11.2076C1.15361 11.2076 0.967475 11.4023 0.979625 11.6343C1.25161 16.8282 2.84082 18.4173 8.03484 18.6893C8.26684 18.7014 8.46157 18.5153 8.46157 18.283V18.283C8.46157 18.0628 8.28751 17.8824 8.06769 17.8708C7.10349 17.82 6.28761 17.7234 5.59526 17.5695C4.49721 17.3255 3.76071 16.9485 3.24054 16.4283C2.72037 15.9082 2.34341 15.1717 2.09938 14.0736C1.94552 13.3813 1.84889 12.5655 1.79806 11.6014C1.78647 11.3816 1.60606 11.2076 1.38594 11.2076V11.2076ZM18.5476 11.2076C18.3275 11.2076 18.1471 11.3816 18.1355 11.6014C18.0847 12.5655 17.988 13.3813 17.8342 14.0736C17.5902 15.1717 17.2132 15.9082 16.693 16.4283C16.1729 16.9485 15.4364 17.3255 14.3383 17.5695C13.646 17.7233 12.8303 17.82 11.8662 17.8708C11.6464 17.8824 11.4723 18.0628 11.4723 18.2829V18.2829C11.4723 18.5153 11.667 18.7014 11.8991 18.6892C17.0928 18.4173 18.682 16.8281 18.9539 11.6343C18.9661 11.4023 18.78 11.2076 18.5476 11.2076V11.2076ZM18.5476 8.19682C18.78 8.19682 18.9661 8.00209 18.954 7.77008C18.682 2.57614 17.0929 0.986932 11.8991 0.714934C11.667 0.702784 11.4723 0.888917 11.4723 1.12124V1.12124C11.4723 1.34137 11.6464 1.52178 11.8662 1.53337C12.8303 1.5842 13.646 1.68083 14.3383 1.83469C15.4364 2.07872 16.1729 2.45568 16.693 2.97585C17.2132 3.49602 17.5902 4.23252 17.8342 5.33057C17.9881 6.0229 18.0847 6.83876 18.1355 7.80293C18.1471 8.02276 18.3275 8.19682 18.5476 8.19682V8.19682ZM9.96678 18.7343L9.88498 18.7342H10.0486L9.96678 18.7343Z"
      fill="#4B67E2"
    />
    <path
      d="M9.99902 8.85547V11.1054"
      stroke="#4B67E2"
      strokeWidth="0.819005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.25 6.60522V7.35521"
      stroke="#4B67E2"
      strokeWidth="0.819005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.75 6.60522V7.35521"
      stroke="#4B67E2"
      strokeWidth="0.819005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCardDashboardEvent = () => (
  <svg
    width="22"
    height="23"
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.0625 9.96436H16.5"
      stroke="#4B67E2"
      strokeWidth="0.982805"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.0625 12.7144H16.5"
      stroke="#4B67E2"
      strokeWidth="0.982805"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.91406 12.7144C9.05315 12.7144 9.97656 11.7909 9.97656 10.6519C9.97656 9.51277 9.05315 8.58936 7.91406 8.58936C6.77498 8.58936 5.85156 9.51277 5.85156 10.6519C5.85156 11.7909 6.77498 12.7144 7.91406 12.7144Z"
      stroke="#4B67E2"
      strokeWidth="0.982805"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.25098 14.7768C5.40356 14.1865 5.74794 13.6636 6.23001 13.2903C6.71208 12.917 7.30452 12.7144 7.91423 12.7144C8.52395 12.7143 9.1164 12.9169 9.5985 13.2902C10.0806 13.6635 10.425 14.1863 10.5776 14.7766"
      stroke="#4B67E2"
      strokeWidth="0.982805"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5625 4.46436H3.4375C3.0578 4.46436 2.75 4.77216 2.75 5.15186V17.5269C2.75 17.9066 3.0578 18.2144 3.4375 18.2144H18.5625C18.9422 18.2144 19.25 17.9066 19.25 17.5269V5.15186C19.25 4.77216 18.9422 4.46436 18.5625 4.46436Z"
      stroke="#4B67E2"
      strokeWidth="0.982805"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconProfile = () => (
  <svg
    width="238"
    height="203"
    viewBox="0 0 238 203"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    {/* <circle cx="113" cy="107" r="70" fill="url(#pattern0)" /> */}
    <path
      d="M201.227 69.1571C192.431 48.6515 176.768 31.85 156.928 21.6401L154.732 25.9081C173.579 35.6075 188.46 51.5689 196.815 71.0493L201.227 69.1571Z"
      fill="#4B67E2"
    />
    <path
      d="M144.457 16.3002C123.377 8.98896 100.408 9.2489 79.4983 17.0354L81.5084 22.4333C101.163 15.114 122.754 14.8696 142.57 21.7422L144.457 16.3002Z"
      fill="#007BFF"
      fillOpacity="0.16"
    />
    <path
      d="M67.2445 22.6055C47.6296 33.2399 32.3314 50.3748 23.9794 71.0649L29.3206 73.221C37.1715 53.7723 51.5518 37.6656 69.9899 27.6691L67.2445 22.6055Z"
      fill="#007BFF"
      fillOpacity="0.16"
    />
    <path
      d="M20.323 81.9606C14.5033 103.501 16.3684 126.395 25.5976 146.709L30.8417 144.327C22.1663 125.231 20.4131 103.711 25.8836 83.463L20.323 81.9606Z"
      fill="#007BFF"
      fillOpacity="0.16"
    />
    <path
      d="M199.94 147.711C209.402 127.504 211.53 104.632 205.959 83.027L201.311 84.2257C206.604 104.751 204.582 126.479 195.593 145.675L199.94 147.711Z"
      fill="#4B67E2"
    />
    <circle cx="93.5513" cy="4.38775" r="4.38775" fill="#FBBC66" />
    <circle cx="2.7551" cy="25.7551" r="1.7551" fill="#67F2A8" />
    <path
      d="M10.5306 110.49C7.97957 109.572 6.81373 108.383 5.26531 105.225C4.11037 108.207 2.95798 109.37 0 110.49C3.00419 111.54 4.06076 112.782 5.26531 115.755C6.42295 112.589 7.50397 111.347 10.5306 110.49Z"
      fill="#8FA3FB"
    />
    <path
      d="M213.041 56.0204C209.639 54.7969 208.085 53.2114 206.02 49C204.48 52.9771 202.944 54.5271 199 56.0204C203.006 57.4199 204.414 59.0767 206.02 63.0408C207.564 58.8189 209.005 57.1635 213.041 56.0204Z"
      fill="#FFD955"
    />
    <circle cx="236" cy="114" r="2" fill="#F6ADBD" />
  </svg>
);

export {
  IconProfile,
  IconFingerDashboardEvent,
  IconFaceDashboardEvent,
  IconCardDashboardEvent,
  IconCardDashboard,
  IconCardFly,
  IconSetting,
  IconSync,
  IconFinger,
  IconCard,
  IconFace,
  IconOption,
  IconHiddenPass,
  IconShowPass,
  IconArrowDown,
  IconFile,
  IconViewDetail,
  IconUl,
  IconUpdrageLicense,
  IconEditSchedule,
  IconEraser,
  IconRecord,
  IconStop,
  IconLock,
  IconUnLock,
  IconTime,
  IconEdit,
  IconDelete,
  IconDownLoad,
  IconCalenda,
  IconClock,
  IconSelect,
  IconNotSelect,
  IconPlus,
  IconFilter,
  IconDeleteHeader,
  IconSearch,
  IconCalendaGreen,
  IconLayout,
  IconCamera,
  IconCut,
  IconPre,
  IconNext,
  IconPause,
  IconOpenPopup,
  IconList,
  IconCopy,
  IconCopyLicence,
  IconSchedule,
  IconWarning,
};
