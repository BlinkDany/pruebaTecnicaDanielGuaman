import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { IUsuarioListado, IUsuarioParams } from "../../ts/IUsuario";
import { AxiosErrorType } from "../../utils/ICommonTypes";
import { usuarioKeys } from "./usuarioKeys";
import { usuariosAPI } from "../../api/usuarios";

export const useUsuariosListado = (
  filtros: IUsuarioParams,
  queryOptions?: Omit<
    Parameters<
      typeof useInfiniteQuery<
        IUsuarioListado,
        AxiosErrorType,
        InfiniteData<IUsuarioListado>,
        ReturnType<(typeof usuarioKeys)["usuariosParams"]>,
        number
      >
    >[0],
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return useInfiniteQuery<
    IUsuarioListado,
    AxiosErrorType,
    InfiniteData<IUsuarioListado>,
    ReturnType<(typeof usuarioKeys)["usuariosParams"]>,
    number
  >({
    queryKey: usuarioKeys.usuariosParams(filtros),
    queryFn: ({ pageParam }) => usuariosAPI.listado(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const hasMore = lastPage.results?.length > 0;
      return hasMore ? lastPageParam + 1 : undefined;
    },
    ...queryOptions,
  });
};
