import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { unminedTileRelativePath, unminedTileUrl } from './unmined-tile-url.ts';

describe('unminedTileRelativePath', () => {
  it('builds the path of an observed Overworld tile at zoom 0', () => {
    assert.equal(
      unminedTileRelativePath({
        zoom: 0,
        tileX: 0,
        tileY: 0,
        imageFormat: 'jpeg',
      }),
      'zoom.0/0/0/tile.0.0.jpeg',
    );
  });

  it('keeps negative zoom in the zoom.N folder name', () => {
    assert.equal(
      unminedTileRelativePath({
        zoom: -6,
        tileX: 0,
        tileY: 0,
        imageFormat: 'jpeg',
      }),
      'zoom.-6/0/0/tile.0.0.jpeg',
    );
  });

  it('groups tiles into xd/yd folders of 10', () => {
    assert.equal(
      unminedTileRelativePath({
        zoom: 0,
        tileX: 15,
        tileY: -12,
        imageFormat: 'jpeg',
      }),
      'zoom.0/1/-2/tile.15.-12.jpeg',
    );
  });
});

describe('unminedTileUrl', () => {
  it('joins the copy URI, tiles folder, and zoom.N layout', () => {
    assert.equal(
      unminedTileUrl({
        baseUrl: 'file:///maps/abc',
        tilePath: 'tiles/',
        zoom: 0,
        tileX: 0,
        tileY: 0,
        imageFormat: 'jpeg',
      }),
      'file:///maps/abc/tiles/zoom.0/0/0/tile.0.0.jpeg',
    );
  });
});
