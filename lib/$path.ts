/* eslint-disable */
// prettier-ignore
export const pagesPath = {
  animation: {
    gallery: {
      _id: (id: string | number) => ({
        $url: (url?: { hash?: string }) => ({ pathname: '/animation/gallery/[id]' as const, query: { id }, hash: url?.hash })
      }),
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/gallery' as const, hash: url?.hash })
    },
    tinder: {
      $url: (url?: { hash?: string }) => ({ pathname: '/animation/tinder' as const, hash: url?.hash })
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
  three: {
    iconview: {
      $url: (url?: { hash?: string }) => ({ pathname: '/three/iconview' as const, hash: url?.hash })
    }
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
