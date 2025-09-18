'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useCollaboration } from '../../hooks/useCollaboration';

const Builder = () => {
  const [pageId] = useState('page_123'); // Get from props/router
  const [userId] = useState("user_1758112633950"); // Get from auth context
  const [userToken] = useState(
		'j"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzE3NTgxMTI2MzM5NTAiLCJlbWFpbCI6ImFiY0BhYmMuYWJjIiwibmFtZSI6ImFiYyIsInJvbGUiOiJlZGl0b3IiLCJpYXQiOjE3NTgxMTM0OTIsImV4cCI6MTc1ODE5OTg5Mn0.Ch4n6904N8GnLrE82TM2Tn8oyEaLwr32IwkZWdZ0lrg"'
	); // Get from auth
  
  const builderRef = useRef(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  
  const {
    pageState,
    activeUsers,
    selectedBlocks,
    cursors,
    isConnected,
    emitPageUpdate,
    selectBlock,
    deselectBlock,
    updateCursor,
    emitTextEdit
  } = useCollaboration(pageId, userId, userToken);

  // Handle mouse movement for cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (builderRef.current) {
        const rect = builderRef.current.getBoundingClientRect();
        updateCursor(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [updateCursor]);

  const handleBlockClick = (blockId) => {
    if (selectedBlockId) {
      deselectBlock(selectedBlockId);
    }
    setSelectedBlockId(blockId);
    selectBlock(blockId);
  };

  const handleBlockUpdate = (blockId, updates) => {
    const updatedBlocks = updateBlockInTree(pageState.blocks, blockId, updates);
    emitPageUpdate(updatedBlocks, 'update', blockId);
  };

  const handleAddBlock = (parentId, blockType) => {
    const newBlock = {
      id: Date.now(),
      type: blockType,
      label: `${blockType}-${Date.now()}`,
      content: `New ${blockType} Element`,
      options: {},
      children: [],
      parent_id: parentId
    };

    let updatedBlocks;
    if (parentId) {
      updatedBlocks = addBlockToParent(pageState.blocks, parentId, newBlock);
    } else {
      updatedBlocks = [...pageState.blocks, newBlock];
    }

    emitPageUpdate(updatedBlocks, 'add', newBlock.id);
  };

  const handleDeleteBlock = (blockId) => {
    const updatedBlocks = removeBlockFromTree(pageState.blocks, blockId);
    emitPageUpdate(updatedBlocks, 'delete', blockId);
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const updateBlockInTree = (blocks, targetId, updates) => {
    return blocks.map(block => {
      if (block.id === targetId) {
        return { ...block, ...updates };
      }
      if (block.children) {
        return {
          ...block,
          children: updateBlockInTree(block.children, targetId, updates)
        };
      }
      return block;
    });
  };

  const addBlockToParent = (blocks, parentId, newBlock) => {
    return blocks.map(block => {
      if (block.id === parentId) {
        return {
          ...block,
          children: [...(block.children || []), newBlock]
        };
      }
      if (block.children) {
        return {
          ...block,
          children: addBlockToParent(block.children, parentId, newBlock)
        };
      }
      return block;
    });
  };

  const removeBlockFromTree = (blocks, targetId) => {
    return blocks.filter(block => {
      if (block.id === targetId) return false;
      if (block.children) {
        block.children = removeBlockFromTree(block.children, targetId);
      }
      return true;
    });
  };

  const renderBlock = (block) => {
    const isSelected = selectedBlockId === block.id;
    const isSelectedByOther = selectedBlocks.has(block.id);
    const selectedByUser = selectedBlocks.get(block.id);

    return (
      <div
        key={block.id}
        className={`relative border-2 border-dashed p-4 m-2 min-h-[60px] transition-all duration-200 ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : isSelectedByOther
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleBlockClick(block.id);
        }}
      >
        {/* Selection indicator for other users */}
        {isSelectedByOther && (
          <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Editing by {selectedByUser}
          </div>
        )}

        {/* Block content */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {block.label} ({block.type})
          </span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddBlock(block.id, 'text');
              }}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Add Child
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(block.id);
              }}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Editable content */}
        {block.type === 'text' && (
          <div
            contentEditable
            className="mt-2 p-2 border rounded min-h-[40px] outline-none focus:ring-2 focus:ring-blue-500"
            dangerouslySetInnerHTML={{ __html: block.content }}
            onInput={(e) => {
              const newContent = e.target.innerHTML;
              emitTextEdit(block.id, newContent, 0);
              handleBlockUpdate(block.id, { content: newContent });
            }}
          />
        )}

        {/* Render children */}
        {block.children && block.children.length > 0 && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4 mt-2">
            {block.children.map(child => renderBlock(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Page Builder</h2>
        
        {/* Connection status */}
        <div className={`mb-4 p-2 rounded ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        {/* Active users */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Active Users ({activeUsers.length})</h3>
          {activeUsers.map(user => (
            <div key={user.userId} className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {user.userName.charAt(0)}
              </div>
              <span className="text-sm">{user.userName}</span>
            </div>
          ))}
        </div>

        {/* Block tools */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Add Elements</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleAddBlock(null, 'container')}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Container
            </button>
            <button
              onClick={() => handleAddBlock(null, 'text')}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Text
            </button>
            <button
              onClick={() => handleAddBlock(null, 'image')}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Image
            </button>
          </div>
        </div>
      </div>

      {/* Main canvas */}
      <div className="flex-1 relative" ref={builderRef}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            Collaborative Page Builder
            {pageState.lastModifiedBy && (
              <span className="text-sm text-gray-500 ml-2">
                Last modified by {pageState.lastModifiedBy}
              </span>
            )}
          </h1>

          {/* Render page blocks */}
          <div className="min-h-[600px] bg-white border border-gray-200 p-4">
            {pageState.blocks.length > 0 ? (
              pageState.blocks.map(block => renderBlock(block))
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <p>No elements added yet. Start building!</p>
              </div>
            )}
          </div>
        </div>

        {/* Render other users' cursors */}
        {Array.from(cursors.entries()).map(([cursorUserId, cursor]) => (
          cursorUserId !== userId && (
            <div
              key={cursorUserId}
              className="absolute pointer-events-none z-50"
              style={{
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {cursor.userName}
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Builder;
