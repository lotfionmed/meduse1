import { jaundiceMindMap } from '../../../mindmaps/jaundice-mindmap';

export const media = {
  audio: {
    url: 'https://www.dropbox.com/scl/fi/example-audio-url/audio.mp3?raw=1',
    title: 'Podcast médical sur Icter'
  },
  mindMap: jaundiceMindMap,
  images: [
    {
      url: 'https://example.com/image1.jpg',
      title: 'Icter - Vue d\'ensemble',
      description: 'Description détaillée de l\'image principale',
      structures: [
        {
          name: 'Structure 1',
          description: 'Description de la structure anatomique 1'
        },
        {
          name: 'Structure 2',
          description: 'Description de la structure anatomique 2'
        }
      ]
    },
    {
      url: 'https://example.com/image2.jpg',
      title: 'Icter - Aspects spécifiques',
      description: 'Description détaillée des aspects spécifiques',
      structures: [
        {
          name: 'Structure 3',
          description: 'Description de la structure anatomique 3'
        },
        {
          name: 'Structure 4',
          description: 'Description de la structure anatomique 4'
        }
      ]
    }
  ]
};