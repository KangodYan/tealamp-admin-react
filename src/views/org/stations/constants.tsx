import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { dayjsFormat } from '@/utils';

export interface InputType {
    name?: string;
    orgId?: number;
    timeRange?: string;
    rangePicker?: string;
    state?: boolean;
    describe?: string;
    page?: number;
    limit?: number;
}

export interface OutputType {
    key?: React.Key;
    id?: number;
    name?: string;
    orgId?: number;
    orgMap?: OutputType;
    state?: boolean;
    describe?: string;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    createdOrgId?: number;
}

interface IProps {
    onOpenFormHandler: (clickOne: OutputType) => void;
    onDelHandler: (ids: number[]) => void;
}

export const columns: ({ onOpenFormHandler, onDelHandler }: IProps) => ColumnsType<OutputType> = ({
    onOpenFormHandler,
    onDelHandler,
}) => [
    {
        title: '岗位名称',
        dataIndex: 'name',
    },
    {
        title: '机构',
        dataIndex: 'orgMap',
        key: 'orgId',
        render: (orgMap) => orgMap?.label,
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
    },
    {
        title: '描述',
        dataIndex: 'describe',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 170,
        render: (createdAt) => dayjsFormat(createdAt),
    },
    {
        title: '操作',
        key: 'action',
        width: 150,
        render: (_, record) => (
            <Space size="middle">
                <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onOpenFormHandler(record)}
                />
                <Button
                    key="del"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelHandler([record.id!])}
                />
            </Space>
        ),
    },
];
