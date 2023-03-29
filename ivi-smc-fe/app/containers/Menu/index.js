import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Skeleton from '@material-ui/lab/Skeleton';
// import Cookies from 'js-cookie';
import 'animate.css';
import DefaultMenuIcon from 'images/MenuIcons/default.svg';
import { isEmpty } from 'lodash';
import PopupState, { bindHover, bindMenu } from 'material-ui-popup-state';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import React, { createContext, forwardRef, Fragment, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  changeExpandedItems,
  // logout,
  changeSelectedItems,
  loadMenu,
  loadUserAuthority,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectApiMessage,
  makeSelectIsAuthorityLoaded,
  makeSelectIsMenuExpanded,
  makeSelectMenuLoaded,
  makeSelectUserMenu,
  makeSelectUserMenuRawData,
} from './selectors';



const key = 'usermenu';

const useStyles = makeStyles(() => ({
  menu: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));
const SMCMenu = styled.div`
  position: relative;
  min-width: 68px;
  top: 0px;
  left: 0px;

  background-color: 'red';
  height: 100%;
  display: flex;
  flex-direction: column;
  &.expaned {
    width: 252px;
    min-width: 252px;
  }
`;
const SMCMenuItem = styled.a`
  &:focus {
    outline: none;
  }
  background-color: 'red';
  text-decoration: none;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 19px;
  width: calc(100% - 20px);
  height: auto;
  margin: 8px 10px 0px 10px;
  &&.selected,
  &:hover {
    border-radius: 4px;
    background-color: var(--main-second-color);
    .menu-text {
      color: #2c2c2e;
    }
  }
  &&.selected::after {
    content: '';
    height: 100%;
    position: absolute;
    top: 0px;
    right: -10px;
    background-color: var(--primary-color);
    width: 2px;
    z-index: 1;
  }
`;
const SMCMenuItemImage = styled(SVG)`
  width: 16px;
  height: 16px;
`;
const SMCMenuItemText = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  font-size: 13px;
  height: 34px;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  font-weight: 400;
  && {
    color: #000;
  }
  .expaned & {
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
  }
`;
const ExpandChildButton = styled(IconButton)`
  && {
    z-index: 9;
    font-size: 20px;
  }
  && svg {
    fill: #000;
  }
  .selected && svg {
    fill: var(--primary-color);
  }
  &.MuiIconButton-root:hover {
    background-color: transparent;
  }
`;

const MenuItemContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 19px;
  flex-direction: column;
  height: max-content;
  background-color: var(--menu-bg-color);
  svg g [fill] {
    transition: fill 0.3s ease;
    fill: #494b74;
  }
  .expaned & {
    justify-content: flex-start;
  }
`;
const SubMenu = styled.div`
  && {
    margin-left: -20px;
    border-radius: 2px;
    font-size: 19px;
    position: relative;
    overflow: visible;
    padding: 0px 0px 0px 0px;
    margin: 0px 0px -10px 0px;
    width: calc(100% + 20px);
    list-style-type: none;
    color: var(--main-text-light-color);
  }
  &::before {
    content: '';
    width: 1px;
    height: 100%;
    position: absolute;
    background-color: rgba(60, 60, 67, 0.3);
  }
`;

const SubMenuItem = styled.a`
  text-decoration: none;
  padding: 5px 21px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  height: 48px;
  margin: 7px 0px 0px 0px;
  .expaned & {
    justify-content: flex-start;
    padding: 10px;
    padding-right: 0;
  }
  &&:last-child {
    margin-bottom: 12px;
  }
  &&.selected,
  &&:hover {
    color: var(--content-color);
    border-radius: 4px;
    background-color: var(--main-second-color);
  }
  &&:hover .expand-child-icon svg {
    color: var(--content-color);
    fill: var(--content-color);
  }
  .level2-item-text,
  &&.selected .expand-child-icon svg,
  &&.selected .level2-item-text,
  &&:hover .level2-item-text {
    color: var(--content-color);
  }
  .expaned &&.selected,
  .expaned &&:hover {
    border-radius: 4px;
  }
  && img {
    filter: invert(100%);
  }
  &&.selected img,
  &&:hover img {
    filter: invert(0%);
  }
  &&.selected::before,
  &&:hover::before {
    content: '';
    height: calc(100%);
    position: absolute;
    top: 0px;
    left: -0.5px;
    background-color: var(--primary-color);
    width: 2px;
    z-index: 1;
    border-radius: 100px;
  }
`;
const SMCSubMenuItemText = styled.div`
  width: 185px;
  min-width: 120px;
  margin-left: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  font-size: 13px;
  padding-left: 13px;
  font-weight: 400;
  && {
    color: #000;
  }
`;
const MenuItemImageAndTextContainer = styled.div`
  display: flex;
  max-width: 232px;
  width: 100%;
  flex: 1;
  align-items: center;
`;
const MenuItemImageContainer = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  align-self: stretch;
`;
const MenuItemTextContainer = styled.div`
  width: calc(100% - 48px);
`;
const RoundContainer = styled.div`
  &:focus {
    outline: none;
    background-color: var(--main-second-color);
  }
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  .expaned & {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }
`;
const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
`;
const Level3Item = styled.a`
  width: 250px;
  height: 48px;
  && {
    color: #3c3c43;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  padding: 0px 16px;
  margin-bottom: 7px;
  &&:hover {
    background-color: var(--main-second-color);
    color: #2c2c2e;
  }
  &&:last-child {
    margin-bottom: 0;
  }
`;
function convertKeyToPath(key) {
  if (key) {
    if (key === 'home') return `/`;
    if (key[0] === '/') {
      return `/${key.substr(1)}`;
    }
    return `/${key}`;
  }
  return `/`;
}

export function Menu({
  userMenus,
  onLoadMenu,
  isMenuLoaded,
  userMenusRawData,
  isExpand,
  onChangeSelectedItems,
  onChangeExpandedItems,
  isDataLoaded,
  onLoadUserAuthority,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const classes = useStyles();
  const ParentPopupState = createContext(null);
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (!isMenuLoaded || userMenusRawData.length <= 0) return;
    const selectedItem2 =
      location.pathname == '/'
        ? userMenusRawData.find((item) =>
            matchPath(location.pathname, { path: item.url }),
          )
        : userMenusRawData.find(
            (item) =>
              item.url != '/' &&
              matchPath(location.pathname, { path: item.url }),
          );
    if (selectedItem2) {
      onChangeSelectedItems(selectedItem2);
    }
  }, [location, isMenuLoaded]);

  const checkShouldSelect = (item) => Boolean(item.selected);
  useEffect(() => {
    if (!isMenuLoaded) {
      onLoadMenu();
    }
    if (!isDataLoaded) {
      onLoadUserAuthority();
    }
  }, []);
  const sortByOrder = (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0);
  const SubPop = forwardRef(({ data, root, ...props }, ref) => (
    <ParentPopupState.Consumer>
      {(parentPopupState) => {
        if (data.children && data.children.length > 0) {
          return (
            <PopupState
              variant="popover"
              popupId={data.code}
              parentPopupState={parentPopupState}
            >
              {(popupState) => (
                <>
                  <Level3Item ref={ref} {...bindHover(popupState)}>
                    {data.text}
                    <KeyboardArrowRightIcon
                      className="expand-child-icon"
                      style={{ fontSize: '20px' }}
                    />
                  </Level3Item>
                  <ParentPopupState.Provider value={popupState}>
                    <HoverMenu
                      {...bindMenu(popupState)}
                      classes={{ list: classes.menu }}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      getContentAnchorEl={null}
                    >
                      <div
                        style={{
                          width: '250px',
                        }}
                      >
                        {[...data.children].sort(sortByOrder).map((item) => {
                          const path = convertKeyToPath(item.key);
                          return (
                            <SubPop
                              data={item}
                              key={item.id}
                              href={path}
                              onClick={(e) => {
                                root.close();
                                e.preventDefault();
                                e.stopPropagation();
                                history.push(path);
                              }}
                              root={root}
                            />
                          );
                        })}
                      </div>
                    </HoverMenu>
                  </ParentPopupState.Provider>
                </>
              )}
            </PopupState>
          );
        }
        return (
          <Level3Item {...props} ref={ref}>
            {data.text}
          </Level3Item>
        );
      }}
    </ParentPopupState.Consumer>
  ));

  const renderSubMenu = (item) =>
    item.expanded && isExpand && item.children && item.children.length > 0 ? (
      <MenuItemImageAndTextContainer style={{ width: '100%' }}>
        <MenuItemImageContainer />
        <MenuItemTextContainer>
          <SubMenu dense style={{ marginLeft: '-20px' }}>
            {[...item.children].sort(sortByOrder).map((el) =>
              el.isShowMenu == true ? (
                el.children && el.children.length > 0 ? (
                  <PopupState variant="popover" popupId={el.code} key={el.id}>
                    {(popupState) => (
                      <>
                        <SubMenuItem
                          className={el.selected ? 'selected' : ''}
                          {...bindHover(popupState)}
                        >
                          <SMCSubMenuItemText className="level2-item-text menu-text ">
                            {el.text}
                          </SMCSubMenuItemText>
                          <ExpandChildButton disableRipple>
                            <KeyboardArrowRightIcon
                              className="expand-child-icon"
                              style={{ fontSize: '20px' }}
                            />
                          </ExpandChildButton>
                        </SubMenuItem>
                        <ParentPopupState.Provider value={popupState}>
                          <HoverMenu
                            {...bindMenu(popupState)}
                            classes={{
                              list: classes.menu,
                            }}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            getContentAnchorEl={null}
                          >
                            <div
                              style={{
                                width: '250px',
                              }}
                            >
                              {[...el.children]
                                .sort(sortByOrder)
                                .map((item) => {
                                  const path = convertKeyToPath(item.key);
                                  return (
                                    <SubPop
                                      data={item}
                                      key={item.id}
                                      href={path}
                                      onClick={(e) => {
                                        popupState.close();
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push(path);
                                      }}
                                      root={popupState}
                                    />
                                  );
                                })}
                            </div>
                          </HoverMenu>
                        </ParentPopupState.Provider>
                      </>
                    )}
                  </PopupState>
                ) : (
                  <SubMenuItem
                    title={el.text}
                    className={el.selected ? 'selected' : ''}
                    href={window.location.origin + convertKeyToPath(el.key)}
                    key={el.id}
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(convertKeyToPath(el.key));
                      e.stopPropagation();
                    }}
                  >
                    <SMCSubMenuItemText className="level2-item-text menu-text ">
                      {el.text}
                    </SMCSubMenuItemText>
                  </SubMenuItem>
                )
              ) : null,
            )}
          </SubMenu>
        </MenuItemTextContainer>
      </MenuItemImageAndTextContainer>
    ) : null;
  /* eslint-disable global-require */
  const loadImage = (src) => {
    try {
      return require(`${src}`);
    } catch (ex) {
      return DefaultMenuIcon;
    }
  };
  const loadingSkeleton = React.Children.toArray(
    new Array(5)
      .fill()
      .map(() => (
        <Skeleton
          variant="rect"
          animation="wave"
          width="calc( 100% - 20px )"
          height="48px"
          style={{ margin: '7px 10px 0px 10px' }}
        />
      )),
  );
  return (
    <>
    <h1>abc </h1>
    <SMCMenu
      id="smc_menu"
      className={isExpand ? 'expaned' : ''}
      style={{ alignItems: isExpand ? 'start' : 'center' }}
    >
      {/* <ScrollContainer>
        <MenuItemContainer id='menu1' key='menu1'>
          <SMCMenuItem
              tabIndex={-1}
              href='#'
              className='selected'
              title='Menu1'
            >
              <MenuItemImageAndTextContainer>
                <SMCMenuItemText className="menu-text ">
                  Menu1
                </SMCMenuItemText>
              </MenuItemImageAndTextContainer>
            </SMCMenuItem>
        </MenuItemContainer>
      </ScrollContainer> */}



      <ScrollContainer>
        {!isMenuLoaded
          ? loadingSkeleton
          : [...userMenus].sort(sortByOrder).map((item) => (
              <MenuItemContainer id={item.id} key={item.id}>
                <SMCMenuItem
                  tabIndex={-1}
                  href={
                    isEmpty(item.key) || item.key === '#'
                      ? '#'
                      : window.location.origin + convertKeyToPath(item.key)
                  }
                  className={checkShouldSelect(item) ? 'selected' : ''}
                  title={item.text}
                  onClick={(e) => {
                    if (isExpand && item.children && item.children.length > 0) {
                      e.preventDefault();
                      e.stopPropagation();
                      onChangeExpandedItems(item);
                    }
                    return false;
                  }}
                  onKeyPress={(e) => {
                    if (e.which == 13) {
                      const href =
                        item.key === null || item.key === '#'
                          ? '#'
                          : convertKeyToPath(item.key);
                      history.push(href);
                    }
                  }}
                >
                  <MenuItemImageAndTextContainer>
                    {!isExpand && item.children && item.children.length > 0 ? (
                      <PopupState variant="popover" popupId={item.code}>
                        {(popupState) => (
                          <>
                            <MenuItemImageContainer {...bindHover(popupState)}>
                              <RoundContainer>
                                <SMCMenuItemImage
                                  src={loadImage(
                                    `./${item.functionCode}${
                                      item.selected ? '_SELECTED' : ''
                                    }.svg`,
                                  )}
                                  viewBox="0 0 16 16"
                                  alt={item.text}
                                  width="16px"
                                  height="16px"
                                />
                              </RoundContainer>
                            </MenuItemImageContainer>
                            <ParentPopupState.Provider value={popupState}>
                              <HoverMenu
                                {...bindMenu(popupState)}
                                classes={{ list: classes.menu }}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                getContentAnchorEl={null}
                              >
                                <div
                                  style={{
                                    width: '250px',
                                  }}
                                >
                                  <Level3Item
                                    style={{
                                      borderBottom: '1px solid #ddd',
                                      fontSize: '16px',
                                    }}
                                  >
                                    {item.text}
                                  </Level3Item>
                                  {[...item.children]
                                    .sort(sortByOrder)
                                    .map((item) => {
                                      const path = convertKeyToPath(item.key);
                                      return (
                                        <SubPop
                                          data={item}
                                          key={item.id}
                                          href={path}
                                          onClick={(e) => {
                                            popupState.close();
                                            e.preventDefault();
                                            e.stopPropagation();
                                            history.push(path);
                                          }}
                                          root={popupState}
                                        />
                                      );
                                    })}
                                </div>
                              </HoverMenu>
                            </ParentPopupState.Provider>
                          </>
                        )}
                      </PopupState>
                    ) : (
                      <MenuItemImageContainer>
                        <RoundContainer>
                          <SMCMenuItemImage
                            src={loadImage(
                              `./${item.functionCode}${
                                item.selected ? '_SELECTED' : ''
                              }.svg`,
                            )}
                            viewBox="0 0 16 16"
                            alt={item.text}
                            width="16px"
                            height="16px"
                          />
                        </RoundContainer>
                      </MenuItemImageContainer>
                    )}
                    {isExpand && (
                      <SMCMenuItemText className="menu-text ">
                        {item.text}
                      </SMCMenuItemText>
                    )}
                  </MenuItemImageAndTextContainer>
                  {isExpand && item.children && item.children.length > 0 && (
                    <ExpandChildButton disableRipple>
                      {item.expanded ? (
                        <ExpandMoreIcon
                          className="expand-child-icon"
                          style={{ fontSize: '20px' }}
                        />
                      ) : (
                        <KeyboardArrowRightIcon
                          className="expand-child-icon"
                          style={{ fontSize: '20px' }}
                        />
                      )}
                    </ExpandChildButton>
                  )}
                </SMCMenuItem>
                {renderSubMenu(item)}
              </MenuItemContainer>
            ))
        }
      </ScrollContainer>
    </SMCMenu>
    </>
  );
}

Menu.propTypes = {};
const mapStateToProps = createStructuredSelector({
  userMenus: makeSelectUserMenu(),
  userMenusRawData: makeSelectUserMenuRawData(),
  isDataLoaded: makeSelectIsAuthorityLoaded(),
  isMenuLoaded: makeSelectMenuLoaded(),
  apiMessage: makeSelectApiMessage(),
  isExpand: makeSelectIsMenuExpanded(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadMenu: () => {
      dispatch(loadMenu());
    },
    onLoadUserAuthority: () => {
      dispatch(loadUserAuthority());
    },
    onChangeSelectedItems: (item) => {
      dispatch(changeSelectedItems(item));
    },
    onChangeExpandedItems: (item) => {
      dispatch(changeExpandedItems(item));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Menu);
