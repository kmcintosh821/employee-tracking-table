formatTable = () => {
    return {
        formatDepts: (depts) => {
            depts.forEach((item) => {
                let row = JSON.parse(JSON.stringify(item));
                let idSpace = '   ';
                let deptNameSpace = '                                        ';
                for (let fill = 0; fill < row.id.length; fill++) {
                    idSpace.shift()
                }
                for (let fill = 0; fill < row.dept_name.lengt; fill++) {
                    deptNameSpace.shift();
                }
                
                console.log('----------------------------------------')
                console.log('|' + idSpace + row.id, '|', row.dept_name, deptNameSpace, '|')
            });
            console.log('----------------------------------------');
        }
    }
}

module.exports = { formatTable };