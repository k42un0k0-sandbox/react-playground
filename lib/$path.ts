/* eslint-disable */
// prettier-ignore
export const pagesPath = {
  animation: {
    curtain: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/curtain' as const, hash: url?.hash })
    },
    dnd: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/dnd' as const, hash: url?.hash })
    },
    gallery: {
      _id: (id: string | number) => ({
        $url: (url?: { hash?: string }) => ({ pathname: '/animation/gallery/[id]' as const, query: { id }, hash: url?.hash })
      }),
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/gallery' as const, hash: url?.hash })
    },
    images_canvas: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/images-canvas' as const, hash: url?.hash })
    },
    intro: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/intro' as const, hash: url?.hash })
    },
    tinder: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/tinder' as const, hash: url?.hash })
    },
    transform: {
      tilt: {
        $url: (url?: { hash?: string }) => ({ pathname: '/animation/transform/tilt' as const, hash: url?.hash })
      }
    },
    water: {
      surface: {
        $url: (url?: { hash?: string }) => ({ pathname: '/animation/water/surface' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/water' as const, hash: url?.hash })
    },
    zoom: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/zoom' as const, hash: url?.hash })
    }
  },
  canvas: {
    puzzle: {
      $url: (url?: { hash?: string }) => ({ pathname: '/canvas/puzzle' as const, hash: url?.hash })
    }
  },
  portal_modal: {
    $url: (url?: { hash?: string }) => ({ pathname: '/portal-modal' as const, hash: url?.hash })
  },
  state_management: {
    constate: {
      $url: (url?: { hash?: string }) => ({ pathname: '/state-management/constate' as const, hash: url?.hash })
    },
    jotai: {
      $url: (url?: { hash?: string }) => ({ pathname: '/state-management/jotai' as const, hash: url?.hash })
    },
    zustand: {
      $url: (url?: { hash?: string }) => ({ pathname: '/state-management/zustand' as const, hash: url?.hash })
    }
  },
  svg: {
    filter: {
      with_canvas: {
        $url: (url?: { hash?: string }) => ({ pathname: '/svg/filter/with-canvas' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/svg/filter' as const, hash: url?.hash })
    }
  },
  three: {
    iconview: {
      interactive: {
        v2: {
          $url: (url?: { hash?: string }) => ({ pathname: '/three/iconview/interactive/v2' as const, hash: url?.hash })
        },
        $url: (url?: { hash?: string }) => ({ pathname: '/three/iconview/interactive' as const, hash: url?.hash })
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/three/iconview' as const, hash: url?.hash })
    },
    mush: {
      $url: (url?: { hash?: string }) => ({ pathname: '/three/mush' as const, hash: url?.hash })
    },
    particle_animation: {
      $url: (url?: { hash?: string }) => ({ pathname: '/three/particle-animation' as const, hash: url?.hash })
    },
    shader: {
      canvas: {
        $01: {
          $url: (url?: { hash?: string }) => ({ pathname: '/three/shader/canvas/01' as const, hash: url?.hash })
        },
        $02: {
          $url: (url?: { hash?: string }) => ({ pathname: '/three/shader/canvas/02' as const, hash: url?.hash })
        },
        vtf: {
          $url: (url?: { hash?: string }) => ({ pathname: '/three/shader/canvas/vtf' as const, hash: url?.hash })
        }
      },
      $url: (url?: { hash?: string }) => ({ pathname: '/three/shader' as const, hash: url?.hash })
    }
  },
  tips: {
    abstract: {
      $url: (url?: { hash?: string }) => ({ pathname: '/tips/abstract' as const, hash: url?.hash })
    },
    effect_deps: {
      $url: (url?: { hash?: string }) => ({ pathname: '/tips/effect-deps' as const, hash: url?.hash })
    }
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
