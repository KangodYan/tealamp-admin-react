import { useMutation, useQuery } from '@tanstack/react-query';

import { globalSuccess } from '@/utils/antd-extract';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { InputType } from '@/views/setting/menus/resource-list.page';

/**
 * 关联其他的列表查询
 */
export const useListResource = (values?: InputType) => {
    return useQuery(['listResource', values], () =>
        service
            .get('resource', {
                params: values,
            })
            .then((res) => res.data),
    );
};

/**
 * 更新用户
 */
export const useUpdateResource = () => {
    return useMutation(async (params: InputType) => service.patch('resource', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listResource']);
        },
    });
};

/**
 * 新建用户
 */
export const useCreateResource = () => {
    return useMutation(async (params: InputType) => service.post('resource', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listResource']);
        },
    });
};

/**
 * 删除多个用户
 */
export const useDeleteResource = () => {
    return useMutation(async (ids: number[]) => service.delete('resource', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listResource']);
        },
    });
};
