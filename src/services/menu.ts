import { useMutation, useQuery } from '@tanstack/react-query';

import { InputType, OutputType } from '@/views/setting/menus/list.page';
import { globalSuccess } from '@/utils/antd-extract';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 树结构查询
 */
export const useListMenuTree = () => {
    return useQuery<OutputType[]>(['listMenuTree'], async () =>
        service.get('menu/tree').then((res) => res.data),
    );
};

/**
 * 树结构查询：给角色模块提供，用于数据隔离
 */
export const useListMenuTreeForRole = () => {
    return useQuery<OutputType[]>(['listMenuTreeForRole'], async () =>
        service.get('menu/tree').then((res) => res.data),
    );
};

/**
 * 更新
 */
export const useUpdateMenu = () => {
    return useMutation(async (params: InputType) => service.patch('/menu', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
    });
};

/**
 * 新建
 */
export const useCreateMenu = () => {
    return useMutation(async (params: InputType) => service.post('/menu', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
    });
};

/**
 * 删除
 */
export const useDeleteMenu = () => {
    return useMutation(async (ids: number[]) => service.delete('/menu', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
    });
};
