const IPFS = require('ipfs');
import { HttpGateway } from 'ipfs-http-gateway';
import { createServer as createGrpcServer } from 'ipfs-grpc-server';
import { create, IPFS } from 'ipfs-core';
import { logger } from '../../utils';
import { Config } from 'ipfs-core-types/src/config';

export let ipfs: IPFS;

async function startIpfsNode() {
  const nodeConfig: Config = {
    Addresses: {
      API: '/ip4/0.0.0.0/tcp/5002',
      Gateway: '/ip4/0.0.0.0/tcp/9090',
      RPC: '/ip4/0.0.0.0/tcp/5003',
      Swarm: [
        "/ip4/0.0.0.0/tcp/4002",
        // "/ip4/127.0.0.1/tcp/8081/ws"
      ]
    },
    Discovery: {
      webRTCStar: {
        Enabled: false,
      },
      MDNS: {
        Enabled: false,
      }
    },
    Pubsub: {
      Enabled: false,
    },
    API: {
      HTTPHeaders: {
        "Access-Control-Allow-Origin": ["*"]
      }
    }
  }
  // Start an IPFS node along with the application
  ipfs = await create({
    config: nodeConfig
  });

  // start the API gateway
  const gateway = new HttpGateway(ipfs);
  await gateway.start();

  const grpcServer = await createGrpcServer(ipfs);
  grpcServer.on('error', () => {
    console.log('error occured');
  });
};

export async function tryIpfsConnecting() {
  try {
    await startIpfsNode();
    logger.info('IPFS Node: started!!');
  } catch(e) {
    logger.error('IPFS Node: failed to start IPFS node!!');
    throw e;
  }
}
