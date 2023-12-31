import { Button, Col, Input, Row, Table, DatePicker, message, Form, Pagination } from 'antd';

import { useEffect, useState } from 'react';

import locale from 'antd/es/date-picker/locale/zh_CN';

import { PageMeta } from '@/utils/types';

import { service } from '@/http/axios/service';

import { useDeleteParam } from '@/services/parameter';

import { DataType, columns } from './constants';
import { ParameterEditForm } from './edit.page';

const { RangePicker } = DatePicker;

export default () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState<PageMeta>();
    const [showInfo, setShowInfo] = useState(false);
    // 列表查询请求
    const listRequest = (values?: DataType) => {
        service
            .get(`/param`, {
                params: {
                    ...values,
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((res) => {
                if (res) {
                    setData(res.data.items);
                    setMeta(res.data.meta);
                }
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    useEffect(() => {
        /**
         * 暂时停止使用useRef解决useEffect多次加载的方法
         * const initialized = useRef(false);
         * ...
         * if (!initialized.current) {
         *   initialized.current = true;
         *   ...
         * }
         */
        // 加载列表查询方法，初始加载和在关闭弹窗时加载
        if (!showInfo) {
            listRequest();
        }
    }, [showInfo]);
    // 删除处理器，点击删除按钮触发
    const onDelHandler = (ids: number[]) => {
        service
            .delete(`/param`, {
                data: {
                    ids,
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((res) => {
                // 剔除掉删除的数据，使用useState重新加载数据
                const updatedData = data.filter((item: DataType) => {
                    return !ids.includes(item.id!);
                });
                setData(updatedData);
                // Antd全局提示
                if (res) message.success('删除成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    const [curId, setCurId] = useState(0);
    // 打开编辑表单处理器，点击按钮触发
    const onOpenFormHandler = (id?: number) => {
        if (id) {
            setCurId(id);
        } else {
            setCurId(0);
        }
        setShowInfo(true);
    };
    // 时间改变时回调，更新时间传值
    const [timedate, setDate] = useState<string[]>([]);
    const dateChangeHandler = (_date: any, dateString: [string, string]) => {
        setDate(dateString);
    };
    // 表单提交时把范围时间传入values参数中
    const onFinishHandler = (values: DataType) => {
        if (timedate.length > 0 && timedate[0] !== '' && timedate[1] !== '') {
            values.timeRange = `'${timedate[0]} 00:00:00','${timedate[1]} 23:56:59'`;
        }
        listRequest(values);
    };
    const resetHandler = () => {
        form.resetFields();
        listRequest();
    };
    // 分页处理
    const onPageChange = (page: number, pageSize: number) => {
        const values = { page, limit: pageSize };
        listRequest(values);
    };
    // 批量删除处理
    const { mutateAsync: delMutate } = useDeleteParam();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>();
    const batchDelHandler = async () => {
        if (!selectedIds) {
            message.error('请勾选数据之后删除');
            return;
        }
        await delMutate(selectedIds);
        listRequest();
        setSelectedIds(undefined);
        setSelectedRowKeys([]);
    };
    // 多选框处理
    const rowSelection = {
        // 指定选中项的 key 数组，从0开始的下标，用于控制数据的勾选，自动的本来可以，手动主要用于删除后的清除
        selectedRowKeys,
        // 选中项发生变化时的回调
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            // 用于显示勾选项
            setSelectedRowKeys(newSelectedRowKeys);
            // 删除时的ids传值
            const ids: number[] = [];
            selectedRows.forEach((val, index) => {
                ids[index] = val.id!;
            });
            setSelectedIds(ids);
        },
    };
    return (
        <div>
            {/* 搜索和操作栏 */}
            <Form form={form} onFinish={onFinishHandler}>
                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item name="key">
                            <Input placeholder="参数键" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="name">
                            <Input placeholder="参数名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="value">
                            <Input placeholder="参数值" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <RangePicker locale={locale} onChange={dateChangeHandler} />
                    </Col>
                    <Col span={2}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={resetHandler}>
                            重置
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={() => onOpenFormHandler()}>
                            添加
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={batchDelHandler}>
                            删除
                        </Button>
                    </Col>
                </Row>
            </Form>
            {/* 表格数据 */}
            <Table
                columns={columns({ onOpenFormHandler, onDelHandler })}
                dataSource={data}
                pagination={false}
                rowSelection={{
                    ...rowSelection,
                }}
            />
            <Pagination
                showSizeChanger
                onChange={onPageChange}
                total={meta?.totalItems}
                current={meta?.currentPage}
            />
            {/* 弹出层表单 */}
            {showInfo && <ParameterEditForm id={curId} onClose={() => setShowInfo(false)} />}
        </div>
    );
};
