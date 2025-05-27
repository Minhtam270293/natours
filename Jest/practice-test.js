// const request = require('supertest');
// const app = require('../app');

// jest.mock('../models/tourModel', () => ({
//   find: jest.fn().mockResolvedValue([]),
// }));

// describe('Root route GET /', () => {
//   test('should respond with 200 OK and render overview page', async () => {
//     const response = await request(app).get('/');
//     expect(response.statusCode).toBe(200);
//   });
// });



const getLatLong = require('./scrapPaper.getLatLong');

global.fetch = jest.fn();

describe('getLatLong', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  test('TC1: Empty input string, no location found, no network/API failure should throw "Location not found"', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => []
    });

    await expect(getLatLong(" ")).rejects.toThrow("Location not found");
  });

  test('TC2: Non-sense input, no location found, no network/API failure should throw "Location not found"', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => []
    });

    await expect(getLatLong("adsfasdf")).rejects.toThrow("Location not found");
  });

  test('TC3: Valid location returns correct coordinates', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [
        { lat: "35.6895", lon: "139.6917" }
      ]
    });

    await expect(getLatLong("Tokyo")).resolves.toEqual({
      latitude: 35.6895,
      longitude: 139.6917
    });
  });

  test('TC4: Empty input string with network/API failure should throw Network error', async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(getLatLong(" ")).rejects.toThrow("Network error");
  });

  test('TC5: Valid input with network/API failure should throw Network error', async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(getLatLong("Tokyo")).rejects.toThrow("Network error");
  });

  test('TC6: Common name used in multiple locations, no network/API failure should return first match coordinates', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [
        { lat: "39.7817", lon: "-89.6501" }, 
        { lat: "44.0462", lon: "-123.0220" } 
      ]
    });

    await expect(getLatLong("Springfield")).resolves.toEqual({
      latitude: 39.7817,
      longitude: -89.6501
    });
  });
});
