import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { OrgChart } from "d3-org-chart";
import * as d3 from "d3";
import { GetMembersAPI } from '../../Api/Module/OrgChartApi';
import NodeFormModal from "./NodeFormModal";
import { useUser } from "../Auth/UserContext";

const OrgChartPage = () => {
    const { user } = useUser();
    const chartRef = useRef();
    const containerRef = useRef();

    const [data, setData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    // ✅ Fetch data
    const fetchEmployees = async () => {

        const res = await GetMembersAPI();
        setData(res.data[0]);
        console.log( res)
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // ✅ Step 6: Map data
    const mapData = (data) => {
        const mapped = data.map((emp) => ({
            id: emp.id,
            parentId: emp.parent_id,
            name: emp.name,
            position: emp.position,
            image: emp.photo
            ? `http://localhost:8000/storage/${emp.photo}`
            : "",
        }));
        console.log("Mapped:", mapped);
        return mapped;
    };

    // ✅ Step 7 + 8: Render chart + drag
    useEffect(() => {
        if (!data.length) return;

        d3.select(containerRef.current).selectAll("*").remove();

        const chart = new OrgChart()
        .container(containerRef.current)
        .data(mapData(data))
        .nodeWidth(() => 240)
        .nodeHeight(() => 80)
        .childrenMargin(() => 20)
        .nodeContent((d) => {
        return `
            <div style="
                display:flex;
                align-items:center;
                padding:10px;
                border:1px solid #8d9096;
                border-radius:10px;
                background:#e5e7eb;;
                box-shadow:0 2px 6px rgba(0,0,0,0.05);
                width:220px;
                font-family:Arial, sans-serif;
            ">

                <!-- IMAGE -->
                <img
                    src="${d.data.image || 'https://via.placeholder.com/50'}"
                    style="
                        width:48px;
                        height:48px;
                        border-radius:50%;
                        object-fit:cover;
                        margin-right:10px;
                        border:2px solid #3b82f6;
                    "
                />

                <!-- TEXT -->
                <div style="text-align:left;">
                    <div style="
                        font-weight:600;
                        font-size:13px;
                        color:#111827;
                        margin-bottom:2px;
                    ">
                        ${d.data.name || 'No Name'}
                    </div>

                    <div style="
                        font-size:11px;
                        color:#6b7280;
                    ">
                        ${d.data.position || ''}
                    </div>
                </div>

            </div>
        `;
        })
        .onNodeClick((d) => {
        setSelectedNode(d.data); // open edit
        })
        // .onNodeDrop(async (args) => {
        //     const draggedId = args.draggedNode.data.id;
        //     const newParentId = args.node.data.id;

        //     await axios.post(`/api/employees/${draggedId}`, {
        //         parent_id: newParentId,
        //     });

        //     // const res = await GetMemberAPI();
        //     // console.log(res)

        //     fetchEmployees(); // refresh
        // });

        chart.render();
        chartRef.current = chart;
    }, [data]);

      // ✅ Step 9: Add employee
    const handleAdd = async () => {
         setSelectedNode({
            parentId: null // or selectedNode?.id if adding under someone
        });
        // const formData = new FormData();
        // formData.append("name", "New Employee");
        // formData.append("position", "Position");
        // formData.append("parent_id", selectedNode?.id || null);

        // // await axios.post("/api/employees", formData);
        // const res = await AddMemberAPI(formData);
        // fetchEmployees();
    };

    return (
        <div className="w-full">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Organizational Chart
                </h2>
                {["ADMIN"].includes(user?.permission) && (
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        + Add Employee
                    </button>
                )}
            </div>

            {/* CHART */}
            <div
                ref={containerRef}
                className="w-full h-[600px] bg-white rounded-xl shadow"
            />

            {/* MODAL */}
            <NodeFormModal
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onSaved={fetchEmployees}
            />
        </div>
    )
}

export default OrgChartPage