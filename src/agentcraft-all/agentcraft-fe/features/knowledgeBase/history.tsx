import React, { useEffect } from "react";
import { Button, Box, Table, LoadingOverlay, Spoiler } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { getChatList, useChatStore } from 'store/chat';
import { useKnowledgeBaseStore } from 'store/knowledgeBase';
import { ChatItem } from 'types/chat';
import { unicodeDecode } from 'utils/chat';
import { formatDateTime } from 'utils/index';
import CopyToClipboard from 'components/CopyToClipboard';

export function ChatHistory() {
    const currentKnowledgeBase = useKnowledgeBaseStore().currentKnowledgeBase;
    const knowledgeBaseId = currentKnowledgeBase?.id;
    const chatList: ChatItem[] = useChatStore().chatList;
    const loading: boolean = useChatStore().loading;
    const setLoading = useChatStore().setLoading;


    const getKnowledgeBaseChatList = async (knowledgeBaseId: any) => {
        setLoading(true);
        await getChatList(knowledgeBaseId);
        setLoading(false);
    }

    const rows = chatList.map((element: ChatItem) => (
        <tr key={element.id}>
            <td>{element.id}</td>
            <td>
                {element.question ?
                    <CopyToClipboard
                        value={element.question}
                        width={110}
                        content={(
                            <Spoiler maxHeight={80} showLabel="显示更多" hideLabel="隐藏">
                                {element.question}
                            </Spoiler>
                        )}
                    />
                    : null}
            </td>
            <td>
                {element.answer ?
                    <CopyToClipboard
                        value={unicodeDecode(element.answer)}
                        content={<Spoiler maxHeight={180} showLabel="显示更多" hideLabel="隐藏">{unicodeDecode(element.answer)}</Spoiler>}
                        width={250}
                    />
                    : null}
            </td>
            <td>
                {element.prompt ?
                    <CopyToClipboard
                        value={element.prompt}
                        content={<Spoiler maxHeight={180} showLabel="显示更多" hideLabel="隐藏">{element.prompt}</Spoiler>}
                        width={250}
                    />
                    : null}
            </td>
            <td>{element.ip}</td>
            <td>
                {element.source ?
                    JSON.stringify(unicodeDecode(element.source)) === '[]' ? '[]' : (
                        <CopyToClipboard
                            value={JSON.stringify(unicodeDecode(element.source))}
                            content={(
                                <Spoiler maxHeight={180} showLabel="显示更多" hideLabel="隐藏">
                                    {JSON.stringify(unicodeDecode(element.source))}
                                </Spoiler>
                            )}
                            width={250}
                            style={{ paddingRight: 30 }}
                        />)
                    : null}
            </td>
            <td>{element.model_name}</td>
            <td>{formatDateTime(element.created)}</td>
            <td>{element.prompt_tokens || '-'}</td>
            <td>{element.completion_tokens || '-'}</td>
        </tr>
    ));
    useEffect(() => {
        if (knowledgeBaseId) {
            getKnowledgeBaseChatList(knowledgeBaseId);
        }

    }, [knowledgeBaseId]);

    return (
        <Box pos="relative" pb={64}>
            <Box mt={4} style={{ textAlign: 'right' }}>
                <Button leftIcon={<IconRefresh />} onClick={() => {
                    getKnowledgeBaseChatList(knowledgeBaseId);
                }} h={32} >
                    刷新
                </Button>
            </Box>
            <LoadingOverlay visible={loading} overlayOpacity={0.3} />
            <Table striped withBorder withColumnBorders mt={12}>
                <thead>
                    <tr>
                        <th>编号</th>
                        <th>问题</th>
                        <th>答案</th>
                        <th>完整提示词</th>
                        <th>访问IP</th>
                        <th>知识库结果</th>
                        <th>使用模型</th>
                        <th>问答创建时间</th>
                        <th>输入Token</th>
                        <th>输出Token</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Box >
    );
}
