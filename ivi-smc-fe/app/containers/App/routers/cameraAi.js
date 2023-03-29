// import ListUserCameraAi from 'containers/ListUserCameraAi/Loadable';
// import DetailUserCameraAi from 'containers/ListUserCameraAi/screens/DetailUser';
// import ListItemCameraAi from 'containers/ListItemCameraAi/Loadable';
// import PlayBackItem from 'containers/ListItemCameraAi/Playback';
// import IntrusionCameraAi from 'containers/IntrusionCameraAi/Loadable';
// import DetailBackListUser from 'containers/DetailBackListUser/Loadable';
// import BlacklistCameraAi from 'containers/BlacklistCameraAi/Loadable';
import ListEvent from 'containers/ListEvent/Loadable';
import ForbiddenArea from 'containers/ForbiddenArea';
import DetailForbiddenArea from 'containers/ForbiddenArea/Detail';
import DetailDefaultEvent from 'containers/ListEvent/screen/DetailDefaultEvent';
import ServerInformation from 'containers/CameraAI/Configua/ServerInformation/Loadable';
import EnginesType from 'containers/CameraAI/Configua/EnginesType/Loadable';
import EdgeManager from 'containers/CameraAI/Configua/Edge/Loadable';
import ListCamera from 'containers/CameraAI/Camera';
import ListSiren from 'containers/CameraAI/Siren';
import EnginesTypeDetailVersionFile from 'containers/CameraAI/Configua/EnginesType/Screen/EnginesTypeDetailVersionFile';
import EnginesTypeDetailEngineImage from 'containers/CameraAI/Configua/EnginesType/Screen/EnginesTypeDetailEngineImage';
import FormEngineImage from 'containers/CameraAI/Configua/EnginesType/Screen/EngineImage/FormEngineImage';
import AddBlacklist from 'containers/BlacklistCameraAi/add';
import BlackListMovementHistory from 'containers/BlacklistCameraAi/movementHistory';
import HumanFaceModule from 'containers/CamAiConfigHumanFaceModule/Loadable';
import MissingItemModule from 'containers/CamAiConfigMissingItemModule/Loadable';
import PetModule from 'containers/PetModule/Loadable';
import EdgeDetails from 'containers/EdgeDetails/DetailInfo';
import EdgeFiles from 'containers/EdgeDetails/files/ListFiles';
import EdgeProcesses from 'containers/EdgeDetails/processes/ListProcesses';
import DetailsProcesses from 'containers/EdgeDetails/processes/details';
import EditFile from 'containers/EdgeDetails/files/EditFile';

export default [
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/human-face-module`,
    component: HumanFaceModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'create',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/human-face-module/:humanFaceId`,
    component: HumanFaceModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'update',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/missing-item-module`,
    component: MissingItemModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'create',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/missing-item-module/:missingItemId`,
    component: MissingItemModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'update',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/pet-module`,
    component: PetModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'create',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/pet-module/:petId`,
    component: PetModule,
    resourceCode: 'cameraai/fpga-process',
    scope: 'update',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:edgeId/fpga-version-file/:id`,
    component: EditFile,
    resourceCode: 'cameraai/fpga-version-file',
    scope: 'get',
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:id/info`,
    component: EdgeDetails,
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:id/processes`,
    component: EdgeProcesses,
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:id/processes/new`,
    component: DetailsProcesses,
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:id/processes/:pId`,
    component: DetailsProcesses,
  },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/edge/:edgeId/fpga-version-file/:id`,
  //   component: EditFile,
  //   resourceCode: 'cameraai/fpga-version-file',
  //   scope: 'get',
  // },
  {
    exact: true,
    path: `/camera-ai/configs/edge/:id/files`,
    component: EdgeFiles,
  },
  {
    exact: true,
    path: `/camera-ai/configs/edge`,
    component: EdgeManager,
  },
  {
    exact: true,
    path: `/camera-ai/camera`,
    component: ListCamera,
  },
  {
    exact: true,
    path: `/camera-ai/siren`,
    component: ListSiren,
  },
  {
    exact: true,
    path: `/camera-ai/configs/engines-type`,
    component: EnginesType,
    resourceCode: 'cameraai/engine-types',
    scope: 'list',
  },
  {
    exact: true,
    path: `/camera-ai/configs/engines-type/:id/file-version`,
    component: EnginesTypeDetailVersionFile,
    resourceCode: 'cameraai/engine-types',
    scope: 'list',
  },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/engines-type/:id/:name/engine-image`,
  //   component: EnginesTypeDetailEngineImage,
  //   resourceCode: 'cameraai/engine-types',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/engines-type/:id/:name/engine-image/add`,
  //   component: FormEngineImage,
  //   resourceCode: 'cameraai/engine-images',
  //   scope: 'create',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/engines-type/:id/:name/engine-image/:engineImageId/edit`,
  //   component: FormEngineImage,
  //   resourceCode: 'cameraai/engine-images',
  //   scope: 'update',
  // },
  {
    exact: true,
    path: `/camera-ai/configs/server-information`,
    component: ServerInformation,
    resourceCode: 'cameraai/server-infor',
    scope: 'list',
  },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-user`,
  //   component: ListUserCameraAi,
  //   resourceCode: 'cameraai/user-detected',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-user/:id`,
  //   component: DetailUserCameraAi,
  //   resourceCode: 'cameraai/user-detected',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-item`,
  //   component: ListItemCameraAi,
  //   resourceCode: 'cameraai/events',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-item/:action/:deviceId/:timeOccur`,
  //   component: PlayBackItem,
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-event/intrusion-event/:id`,
  //   component: IntrusionCameraAi,
  //   resourceCode: 'cameraai/events',
  //   scope: 'get',
  // },
  {
    exact: true,
    path: `/camera-ai/list-event/:id`,
    component: DetailDefaultEvent,
    resourceCode: 'cameraai/events',
    scope: 'get',
  },
  // {
  //   exact: true,
  //   path: `/camera-ai/black-list`,
  //   component: BlacklistCameraAi,
  //   resourceCode: 'cameraai/blacklist-users',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/black-list/add`,
  //   component: AddBlacklist,
  //   resourceCode: 'cameraai/blacklist-users',
  //   scope: 'create',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/black-list/:id/:uuid/histories`,
  //   component: BlackListMovementHistory,
  //   resourceCode: 'cameraai/blacklist-users',
  //   scope: 'get',
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/list-event/black-list-user/:eventId`,
  //   component: DetailBackListUser,
  //   resourceCode: 'cameraai/events',
  //   scope: 'get',
  // },
  {
    exact: true,
    path: `/camera-ai/list-event`,
    component: ListEvent,
    resourceCode: 'cameraai/events',
    scope: 'list',
  },
  {
    exact: true,
    path: `/camera-ai/forbidden-area`,
    component: ForbiddenArea,
    resourceCode: 'cameraai/forbidden-area',
    scope: 'list',
  },
  {
    exact: true,
    path: `/camera-ai/forbidden-area/:id`,
    component: DetailForbiddenArea,
    resourceCode: 'cameraai/forbidden-area',
    scope: 'get',
  },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/:edgeId/human-face-module`,
  //   component: HumanFaceModule,
  // },
  // {
  //   exact: true,
  //   path: `/camera-ai/configs/:edgeId/human-face-module/:humanFaceId`,
  //   component: HumanFaceModule,
  // },
];
