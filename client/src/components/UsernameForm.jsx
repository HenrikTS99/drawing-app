import React from "react";

function Form(props) {
    return (
        <form className="pt-20 flex justify-center">
            <input 
                placeholder="Username"
                type="text"
                value={props.username}
                onChange={props.onChange}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={props.connect}>Connect</button>
        </form>
    );
};

export default Form