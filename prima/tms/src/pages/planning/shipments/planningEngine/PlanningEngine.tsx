import { Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import Button from '../../../../component/widgets/button/Button';
import './PlanningEngine.css';
import { engineImages } from './PlanningUtils';

export default function PlanningEngine(props: any) {
    const { engineConfig, setEngineConfig, setEngineConfigParams } = props;

    function expandSubEnginesMenu(index: any, enabled: any) {
        if (enabled) {
            const res = engineConfig.map((engine: any) => ({ ...engine, showSubEngineMenu: false }));
            res[index].showSubEngineMenu = true;
            setEngineConfig([...res]);
        }
    }

    function selectSubEngine(engineIndex: any, subEngineIndex: any) {
        const res = engineConfig.map((engine: any) => ({
            ...engine, isSelected: false,
            sub_engine_names: engine.sub_engine_names.map((subEngine: any) => ({ ...subEngine, isSelected: false }))
        }));
        res[engineIndex].isSelected = true;
        res[engineIndex].sub_engine_names[subEngineIndex].isSelected = true;
        setEngineConfigParams({
            engine_name: engineConfig[engineIndex].engine_name,
            sub_engine_name: engineConfig[engineIndex].sub_engine_names[subEngineIndex].name
        });
        setEngineConfig([...res]);
    }

    return (
        <div className={'optimus-container container-fluid'}>
            <div className="row optimus-wrap">
                {
                    engineConfig.map((engine: any, index: any) => {
                        return (
                            <div className="col" key={index} >
                                <Box className={`optimus-card  ${!engine.is_enabled && 'card-disable'} ${engine.isSelected && 'active'}`} onClick={() => expandSubEnginesMenu(index, engine.is_enabled)}>
                                    {engine.isSelected && <img src="/images/tick.svg" alt="" className="check-icon" />}
                                    <span className='icon-img'><img src={`/images/${engineImages[engine.engine_name]}.svg`} className="img-fluid" alt="Optimus Consolidated Load" /></span>
                                    <Typography className='title text-truncate'>{engine.engine_name}</Typography>
                                    <ExpandMoreIcon className='icon' />
                                </Box>
                            </div>
                        )
                    })
                }
            </div>
            {
                engineConfig.map((engine: any, index: any) => {
                    return (
                        engine.showSubEngineMenu && <div className={"optimus-content"} key={index}>
                            {
                                engine.sub_engine_names.map((subEngine: any, idx: any) => (
                                    <Button
                                        key={idx}
                                        buttonStyle={"btn-light"}
                                        title={subEngine.name}
                                        disable={!subEngine.enabled}
                                        onClick={() => selectSubEngine(index, idx)}
                                        rightIcon={subEngine.isSelected && <img src="/images/tick.svg" className="check-icon" alt="" />}
                                    />
                                ))
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}
