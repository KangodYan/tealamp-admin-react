import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { globalSuccess } from '@/utils/antd-extract';
import { InputType } from '@/views/setting/roles/resource-allot.page';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 分组菜单和资源的查询
 */
export const useListRoleAuthorityIdByRoleId = (values?: InputType) => {
    return useQuery(['listRoleAuthorityIdByRoleId', values], () =>
        service
            .get('role-authority/listRoleAuthorityIdByRoleId', { params: values })
            .then((res) => res.data),
    );
};

/**
 * 查询角色的菜单分配数据
 */
export const useListRoleMenuByRoleIds = (values?: InputType) => {
    return useQuery(['listRoleMenuByRoleIds', values], () =>
        service.post('role-authority/listRoleMenuByRoleIds', { ...values }).then((res) => res.data),
    );
};

/**
 * 保存角色授权数据，删除再批量插入
 */
export const useSaveBatchRoleAutority = () => {
    return useMutation(
        async (params: InputType) =>
            service.post('role-authority/saveBatchRoleAutority', { ...params }),
        {
            onSuccess: () => {
                globalSuccess();
                queryClient.invalidateQueries(['listRoleAuthorityId']);
            },
        },
    );
};
