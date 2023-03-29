import React, { memo, useState, useCallback} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInterval } from 'ahooks';
import styled from 'styled-components';
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'react-flow-renderer';
const Container = styled.div`
  margin-left: -25px;
  margin-bottom: -25px;
  display: flex;
  margin-right: -25px;
  height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
`;
const SlideContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0px;
`;
const Slide = styled.div`
  z-index: 1;
  display: flex;
  flex: 1;
  background-color: #000000a6;
  width: 70%;
  max-width: 1068px;
  margin: auto;
  padding: 24px 80px;
  min-height: 326px;
  color: #fff;
  line-height: 18.75px;
`;
const SlideImage = styled.img`
  display: flex;
  flex: 1;
`;
const SlideButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  height: 30px;
  align-items: center;
`;
const SlideButton = styled.div`
  width: 9px;
  height: 9px;
  background-color: ${props => (props.enabled ? '#fff' : 'transparent')};
  border-radius: 50%;
  border: ${props => (props.enabled ? '0px' : 'solid 1px #fff')};
  margin-right: 5px;
  cursor: pointer;
`;

const SlideContentGroup = styled.div``;
const SlideContent = styled.div`
  color: #fff;
`;
const SlideContentHeader = styled.div`
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 500;
  line-height: 37px;
`;
const SlideContentBody = styled.div`
  margin-top: 30px;
  font-size: 14px;
  font-weight: 400;
  .sub-title {
    font-size: 16px;
  }
  .list-title {
    margin: 20px 0px;
  }
  div {
    line-height: 20px;
  }
  ul {
    padding: 0;
    margin-left: 15px;
    li {
      line-height: 20px;
    }
  }
`;
const SlideArray = [
  
];
export function HomePage() {
  const history = useHistory();
  const [enabledSlideButton, setEnabledSliderButton] = useState(0);
  useInterval(() => {
    setEnabledSliderButton(prev =>
      prev == SlideArray.length - 1 ? 0 : prev + 1,
    );
  }, 5000);
  const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: {
        label: (
          <>
            Kiểm soát vào ra
          </>
        ),
      },
      position: { x: 250, y: 0 },
    },
    {
      id: '2',
      data: {
        label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('access-control/devices');
            }}
          >
            Quản lý thiết bị
          </div>
        ),
      },
      position: { x: 0, y: 50 },
    },
    {
      id: '3',
      data: {
        label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('card');
            }}
          >
            Quản lý thẻ
          </div>
        ),
      },
      position: { x: 400, y: 50 },
      style: {
        background: '#D6D5E6',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
      },
    },
    {
      id: '4',
      position: { x: 150, y: 100 },
      data: {
        label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('access-control/warning-monitor');
            }}
          >
            Giám sát và cảnh báo
          </div>
        )
      },
    },
    {
      id: '5',
      data: {
        label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('access-control/group-user');
            }}
          >
            Quản lý nhóm người dùng
          </div>
        )
      },
      position: { x: 325, y: 200 },
    },
    {
      id: '6',
      data: {
        label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('access-control/schedule');
            }}
          >
            Quản lý lịch
          </div>
        ),
      },
      position: { x: 0, y: 350 },
    },
    {
      id: '7',
      data: { label: (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            history.push('access-control/door');
          }}
        >
            Quản lý cửa
        </div>
        ) 
      },
      position: { x: 250, y: 350 },
    },
    {
      id: '8',
      data: { label: (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push('access-control/group-access');
            }}
          >
            Nhóm quyền truy cập
          </div>
        ) 
      },
      position: { x: 400, y: 350 },
    },
    {
      id: '21',
      type: 'input',
      data: {
        label: (
          <>
            Thiết bị intercom
          </>
        ),
      },
      position: { x: 250, y: 400 },
    },
    {
      id: '22',
      data: {
        label: (
          <>
            Quản lý server
          </>
        ),
      },
      position: { x: 50, y: 450 },
    },
    {
      id: '23',
      data: {
        label: (
          <>
            Quản lý thiết bị intercom
          </>
        ),
      },
      position: { x: 250, y: 450 },
    },
    {
      id: '31',
      data: {
        label: (
          <>
            Upgrade
          </>
        ),
      },
      position: { x: 250, y: 500 },
    },
    {
      id: '32',
      data: {
        label: (
          <>
            App upgarade
          </>
        ),
      },
      position: { x: 0, y: 550 },
    },
    {
      id: '41',
      data: {
        label: (
          <>
            Logging
          </>
        ),
      },
      position: { x: 250, y: 600 },
    },
    {
      id: '42',
      data: {
        label: (
          <>
            Register history
          </>
        ),
      },
      position: { x: 0, y: 650 },
    },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'Phần này chưa làm',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    { id: 'e1-3', source: '1', target: '3', label: 'Quản lý chung với IAM' },
    {
      id: 'e3-4',
      source: '1',
      target: '4',
      animated: true,
      label: 'Chưa có FE',
    },
    {
      id: 'e6-7',
      source: '6',
      target: '7',
      label: 'ID thiết bị',
    },
    {
      id: 'e6-7',
      source: '6',
      target: '2',
      label: 'ID thiết bị',
      animated: true,
    },
    {
      id: 'e1-7',
      source: '1',
      target: '7',
      type: 'step',
      style: { stroke: '#f6ab6c' },
      label: 'a step edge',
      animated: true,
      labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    },
    {
      id: 'e4-5',
      source: '1',
      target: '5',
      label: 'ID người dùng hoặc ID nhóm người dùng',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e4-5',
      source: '8',
      target: '7',
      label: 'Cấp truy cập cửa',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
  return (
    <Container>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            if (n.type === 'default') return '#1a192b';

            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </Container>
  );
}

HomePage.propTypes = {};

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
