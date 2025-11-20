import React, { useState, useEffect, useMemo} from 'react'
import Table from '../../Component/Table'
import { GetAttritionData, GetManagers, GetAttritionClient } from '../../Api/Module/DashboardApi'
import Select from "react-select";

const AttritionDashboard = () => {
    const [ dataAttrition, setDataAttrition ] = useState([]);
	const [ dataManagers, setDataManagers ] = useState([])
	const currentYear = new Date().getFullYear();
	const years = [];
	const [formData, setFormData] = useState({
		year: currentYear,
		type: "",
		manager: "",
		level: "",
	})
	const [selectedMonth, setSelectedMonth] = useState("All");
	const [filters, setFilters] = useState({});
	const allColumns = [
		{
            header: "",
            children: [
                { header: 'Subject', accessor: 'subject'},
            ],
        },
		{
            header: "Annualized",
            children: [
                { header: 'Start HC', accessor: 'total_start' },
				{ header: 'End HC', accessor: 'total_end' },
				{ header: 'Avg HC', accessor: 'total_avg' },
				{ header: 'Attrition', accessor: 'total_attrition' },
				{ header: '%', accessor: 'total_pct' },
            ],
        },
		{
            header: "January",
            children: [
                { header: 'Start HC', accessor: 'jan_start' },
				{ header: 'End HC', accessor: 'jan_end' },
				{ header: 'Avg HC', accessor: 'jan_avg' },
				{ header: 'Attrition', accessor: 'jan_attrition' },
				{ header: '%', accessor: 'jan_pct' },
            ],
        },
		{
            header: "February",
            children: [
                { header: 'Start HC', accessor: 'feb_start' },
				{ header: 'End HC', accessor: 'feb_end' },
				{ header: 'Avg HC', accessor: 'feb_avg' },
				{ header: 'Attrition', accessor: 'feb_attrition' },
				{ header: '%', accessor: 'feb_pct' },
            ],
        },
    ];

	const filteredColumns =
		selectedMonth === "All"
		? allColumns // show everything
		: [allColumns[0], allColumns.find((col) => col.header === selectedMonth)];
	
	const fetchData = async () => {
		try {
			const response = await GetAttritionData(formData);
			console.log(response);
			setDataAttrition(response.data[0])

			const responseClient = await GetAttritionClient(formData);
			console.log(response);
			// setDataAttrition(responseClient.data[0])
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		setFormData((prev) => {
			const updated = {
			...prev,
			[name]: files ? files[0] : value,
			};

			fetchManagers(updated); // pass the *new* state
			return updated;
		});
	};

	const fetchManagers = async (data) => {
		try {
			const response = await GetManagers(data);
			console.log(response);
			setDataManagers(response.data[0])
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchData();
		fetchManagers(formData);
	}, []);

	for (let i = currentYear; i >= currentYear - 50; i--) {
		years.push(i);
	}

    return (
        <div> 
			<div className="flex items-center gap-4">
				<div className="flex flex-col">
					<label htmlFor="year" className="text-sm font-semibold text-gray-700">
					Select Year
					</label>
					<select
					id="year"
					name="year"
					value={formData.year}
					onChange={handleChange}
					className="p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
					>
					<option value="">-- Select Year --</option>
					{years.map((yr) => (
						<option key={yr} value={yr}>
						{yr}
						</option>
					))}
					</select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="type" className="text-sm font-semibold text-gray-700">
					Select Type
					</label>
					<select
					id="type"
					name="type"  
					value={formData.type}
					onChange={handleChange}
					className="p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
					>
					<option value="">All</option>
					<option value="Non Production">Non Production</option>
					<option value="Production">Production</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="type" className="text-sm font-semibold text-gray-700">
						Select Level
					</label>
					<select
					id="level"
					name="level"  
					value={formData.level}
					onChange={handleChange}
					className="p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
					>
					<option value="">All</option>
					<option value="Senior Leadership">Leadership</option>
					<option value="Associate">Associate</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="year" className="text-sm font-semibold text-gray-700">
						Select Managers
					</label>
					<Select
						options={dataManagers}
						value={dataManagers.find((o) => o.value === filters.subject)}
						onChange={(selected) =>
						setFilters((prev) => ({
							...prev,
							subject: selected?.value || ""   // 👈 filter applies to "subject"
						}))
						}
						placeholder="Select or type Manager"
						isClearable
						isSearchable
						menuPortalTarget={document.body}
						styles={{
						menuPortal: (base) => ({ ...base, zIndex: 9999 }),
						}}
						className="w-full"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="type" className="text-sm font-semibold text-gray-700">
						Select Month
					</label>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
					>
						<option value="All">All Months</option>
							{allColumns
							.filter((col) => col.header) // exclude blank subject header
							.map((col) => (
								<option key={col.header} value={col.header}>
								{col.header}
						</option>
						))}
					</select>
				</div>
				<div className="flex flex-col">
					<button
						onClick={fetchData} // define this function
						className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Apply
					</button>
				</div>
			</div><br/>
            <Table title="Attrition" columns={filteredColumns} data={dataAttrition} filtersManager={filters}/>
        </div>
    )
}

export default AttritionDashboard