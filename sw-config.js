module.exports = {
  runtimeCaching: [
    {
      urlPattern: "/\.mp4$/",
      handler: 'networkFirst',
    },
  ],
};